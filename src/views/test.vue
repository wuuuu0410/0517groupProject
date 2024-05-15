

<script setup>

import { ref } from 'vue';
import axios from 'axios';

async function getSpots2(page) {

    //如果當前頁面等於 0 則當前頁面等於 1
    if (page == 0) {
        page = 1
    }
    //如果當前頁面等於 11 則當前頁面等於 10
    if (page == 11) {
        page = 10
    }

    try {
        // this.isloading = true;
        let spotdata = await axios.get('../spotData' + page + '.json')
        spots.value = spotdata.data
        console.log(spots)
        console.log(123)
    } catch (error) {
        console.log(error);
        console.log(321)
    }
    nowPage = page
}



let nowPage = 1;




let spots = ref({});
getSpots2(1)

const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]


</script>