<template>
  <!-- <div id="infocontainer">
    <div id="scrollcontainer">
      <TruthTable></TruthTable>
    </div>
  </div> -->
  <div id="infocontainer">
    <TruthTable id="scrollcontainer"></TruthTable>
  </div>
</template>

<script>
import TruthTable from "./TruthTable.vue";
export default {
  components: {
    TruthTable,
  },
  mounted() {},
};
</script>

<style>
#infocontainer {
  position: relative;
  border-radius: 0 0 0 25px;
  border: 4px solid gray;
  border-right-width: 0px;
  border-top-width: 0px;
  padding: 0;
  margin: 0;
  float: top;
  height: calc((0.9 * 100vh) - 50vh - 24.5px);
  max-height: calc((0.9 * 100vh) - 50vh - 24.5px);
  overflow-y: scroll;
}
#scrollcontainer {
  position: relative;
  height: 50vh;
}
</style>
