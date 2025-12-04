<script setup>
import {nextTick, onMounted, ref, watch} from "vue";
import axios from "axios";
import {toast} from "vue3-toastify";

  const colleagues = ref(null);
  const selectedEvent = ref(null);
  const selectedEventName = ref(null);
  const events = ref(null);
  const lastThree = ref(null);
  const message = ref("Érinthetik a következő kártyát!");
  const colorClass = ref("bg-green-500/80");
  const cardInput = ref("");
  const inputRef = ref(null);
  const drawerVisible = ref(false);
  const newEventInput = ref("");

  async function readCard() {
    if (selectedEvent.value === null) {
      toast.error("Kérlek először válassz ki egy eseményt az listából!");
      cardInput.value = "";
      return;
    }
    message.value = "Olvasás folyamatban! Kérlek várj!"
    colorClass.value = "bg-red-500/80"
    const cardNumber = cardInput.value.slice(-4);

    try {
      const response = await axios.get("http://localhost:3000/keycloak/getUserByCard/" + cardNumber)
      const employee = response.data.employee;
      const regNumber = employee.attributes.regNumber[0];
      const eventLogAddParams = {
        "regNumber": regNumber,
        "eventId": selectedEvent.value,
        "createdAt": new Date()
      }
      const eventLogAddResponse = await axios.post("http://localhost:3001/event-log/add", eventLogAddParams)
      if (eventLogAddResponse.data.type === 0) {
        toast.error(eventLogAddResponse.data.message);
      } else {
        colleagues.value.push({
            name: employee.lastName + " " + employee.firstName,
            regNumber: employee.attributes.regNumber[0],
            position: employee.attributes.position[0],
            organization: employee.attributes.organization[0]
        })
        lastThree.value = colleagues.value.reverse().slice(0, 3);
      }
    } catch (e) { console.log("Error: " + e) }

    cardInput.value = ""
    message.value = "Érinthetik a következő kártyát!"
    colorClass.value = "bg-green-500/80"
  }

  const focusInput = async () => {
    await nextTick()
    inputRef.value.$el.focus()
  }

  async function getAllEvents () {
    try {
      const response = await axios.get('http://localhost:3001/events/all');
      events.value = response.data.events
    } catch (e) {
      console.log("Error: " + e);
    }
  }

  async function addNewEvent() {
    try {
      const response = await axios.post("http://localhost:3001/events/add", {
        name: newEventInput.value,
        createdAt: new Date
      })
      events.value.push(response.data)
      newEventInput.value = ""
    } catch(e) {
      console.log("Error: " + e);
    }
  }

  const onEventChange = async (event) => {
    const response = await axios.get("http://localhost:3001/event-log/getList/" + event.value);
    colleagues.value = response.data
    lastThree.value = response.data.reverse().slice(0, 3);
  }

  watch(cardInput, () => { focusInput() })

  onMounted(focusInput);
  getAllEvents();
</script>
<template>
  <div class="h-screen grid grid-cols-2" @click="focusInput">
    <div class="h-screen flex flex-col">
      <p>{{ selectedEventName }}</p>
      <Button icon="pi pi-arrow-right" @click="drawerVisible = true" />
      <div class="flex-1" :class="colorClass">
        <p class="text-center" style="font-size: 26pt">
          {{ message }}
        </p>
        <InputText
            ref="inputRef"
            v-model="cardInput"
            class="w-full"
            autofocus
            @keyup.enter="readCard"
        />
        <p class="text-center" style="font-size: 22px">Utolsó 3 kolléga információja</p>
        <div class="flex gap-2 px-2">
          <div v-for="c in lastThree" class="w-full">
            <Card>
              <template #title>
                <div class="text-center">{{ c.name }}</div>
              </template>
              <template #content>
                <span class="font-bold">Törzsszám: </span>{{ c.regNumber }}<br>
                <span class="font-bold">Osztály: </span>{{ c.organization }}<br>
                <span class="font-bold">Pozíció: </span>{{ c.position}}
              </template>
            </Card>
          </div>
        </div>
      </div>
    </div>
    <div class="p-5">
      <DataTable
          :value="colleagues"
          scrollable
          scroll-height="80vh"
      >
        <Column field="name" header="Név"></Column>
        <Column field="regNumber" header="Törzsszám"></Column>
        <Column field="organization" header="Osztály"></Column>
        <Column field="position" header="Pozíció"></Column>
      </DataTable>
      <div class="text-center p-5">
        <Button label="Exportálás Excelbe"></Button>
      </div>
    </div>
  </div>
  <Drawer v-model:visible="drawerVisible" header="Események listája">
    <Listbox
        v-model="selectedEvent"
        @change="onEventChange($event)"
        :options="events"
        optionLabel="name"
        optionValue="id"
        filter
        listStyle="max-height:500px"
    >
    </Listbox>
    <div class="flex justify-around pt-4">
      <InputText v-model="newEventInput" type="text" placeholder="Mi legyen az új esemény?"/>
      <Button icon="pi pi-plus" @click="addNewEvent" :disabled="!newEventInput || newEventInput.trim() === ''"></Button>
    </div>
  </Drawer>
</template>
<style></style>