import { defineStore } from "pinia";

export default defineStore("location",{
    state(){
        return{
            page:1,
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