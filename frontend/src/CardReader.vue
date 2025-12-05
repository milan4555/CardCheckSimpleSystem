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
  const loading = ref(false)

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
      if (!response.data.employee) {
        toast.error(`Az adott kártyaszám (${cardNumber}) nem létezik a rendszerben!`)
        return;
      }
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
    loading.value = true;
    const response = await axios.get("http://localhost:3001/event-log/getList/" + event.value);
    colleagues.value = response.data
    lastThree.value = response.data.reverse().slice(0, 3);
    selectedEventName.value = events.value.filter(e => e.id == selectedEvent.value)
    if (!selectedEventName.value.length) { selectedEventName.value == null }
    drawerVisible.value = false;
    loading.value = false;
  }

  watch(cardInput, () => { focusInput() })

  onMounted(focusInput);
  getAllEvents();
</script>
<template>
  <div @click="focusInput" style="height: 100vh">
    <div class="flex justify-center pt-20">
      <Card style="width: 70%">
        <template #header>
          <h1 class="text-center font-bold pb-3" style="font-size: 30pt">
            <span v-if="!selectedEventName" style="color: red">Nincs kiválaszott esemény</span>
            <span v-if="selectedEventName">{{ selectedEventName[0].name }}</span>
          </h1>
        </template>
        <template #content>
          <div>
            <div class="flex-1 p-4" :class="colorClass">
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
            </div>
          </div>
          <div class="flex gap-2 py-4">
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
          <div class="pt-3">
            <DataTable
                :value="colleagues"
                scrollable
                scroll-height="80vh"
            >
              <template #empty>Nincsenek felvett emberek a listában!</template>
              <Column field="name" header="Név"></Column>
              <Column field="regNumber" header="Törzsszám"></Column>
              <Column field="organization" header="Osztály"></Column>
              <Column field="position" header="Pozíció"></Column>
            </DataTable>
            <div class="flex justify-center gap-2 mt-3">
              <Button label="Események listája" icon="pi pi-list" @click="drawerVisible = true" />
              <Button label="Exportálás Excelbe" severity="success" icon="pi pi-file-excel"></Button>
            </div>
          </div>
        </template>
      </Card>
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