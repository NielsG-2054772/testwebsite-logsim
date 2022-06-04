export default {
    methods: {
      clicked() {
        alert(`${this.mode}`);
        this.mode = "test";
      },
      delayTest(value){
        alert(value);
      }
    }
  };