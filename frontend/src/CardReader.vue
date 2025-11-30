<script setup>
import {nextTick, onMounted, ref, watch} from "vue";

  const colleagues = ref([
    { name: "John Smith", regNumber: "4729", organization: "TechCorp", position: "Software Engineer" },
    { name: "Sarah Johnson", regNumber: "8135", organization: "DataWorks", position: "Data Analyst" },
    { name: "Mike Davis", regNumber: "2901", organization: "Innovate Inc", position: "Project Manager" },
    { name: "Emily Chen", regNumber: "6478", organization: "Global Solutions", position: "UX Designer" },
    { name: "David Wilson", regNumber: "1352", organization: "SecureNet", position: "DevOps Engineer" },
    { name: "Lisa Brown", regNumber: "5916", organization: "FinTech Ltd", position: "Product Owner" },
    { name: "Robert Taylor", regNumber: "3084", organization: "CloudPeak", position: "Backend Developer" },
    { name: "Anna Martinez", regNumber: "7620", organization: "HealthSync", position: "Frontend Developer" },
    { name: "James Anderson", regNumber: "1947", organization: "AutoDrive", position: "QA Engineer" },
    { name: "Maria Garcia", regNumber: "4853", organization: "EduTech", position: "Business Analyst" },
    { name: "Chris Lee", regNumber: "2719", organization: "GreenEnergy", position: "Full Stack Developer" }
  ]);

  const selectedEvent = ref(null)
  const events = ref([
    { name: "2024 - Nőnap", value: 1},
    { name: "2024 - Mikuláscsomag", value: 2},
    { name: "2024 - Karácsonyi buli", value: 3},
    { name: "2025 - Nőnap", value: 4},
    { name: "2025 - Mikuláscsomag", value: 5},
    { name: "2025 - Karácsonyi buli", value: 6},
  ])

  const lastThree = ref(colleagues.value.splice(0,3));
  const message = ref("Érinthetik a következő kártyát!");
  const colorClass = ref("bg-green-500/80");
  const cardInput = ref("");
  const inputRef = ref(null)

  function readCard() {
    message.value = "Olvasás folyamatban! Kérlek várj!"
    colorClass.value = "bg-red-500/80"
    setTimeout(() => {
      cardInput.value = ""
      message.value = "Érinthetik a következő kártyát!"
      colorClass.value = "bg-green-500/80"
    }, 1000)
  }

  const focusInput = async () => {
    await nextTick()
    inputRef.value.$el.focus()
  }

  watch(cardInput, () => { focusInput() })

  onMounted(focusInput)
</script>
<template>
  <div class="h-screen grid grid-cols-2" @click="focusInput">
    <div class="h-screen flex flex-col">
      <div class="flex-1">
        <Listbox
          v-model="selectedEvent"
          :options="events"
          optionLabel="name"
          optionValue="value"
        >
        </Listbox>
      </div>
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
</template>
<style></style>