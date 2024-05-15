import { defineStore } from "pinia";

export default defineStore("location",{
    state(){
        return{
            page:null,
        }
    },
    getters:{
        pageInfo(){
            return `現在位置:${this.page}`
        }
    },
    actions:{
        getPage(){
            console.log(this.page)
        },
        setPage(params){
            this.page = params
        }
    }
})