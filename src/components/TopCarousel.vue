<script>
export default {
    data(){
        return{
            
            currentImg: 0,
            intervalId: null,
            intervalDuration: 3000
        }
    },
    props:{
        carouselImg:{
            default:[]
        }
    },
    mounted(){
        this.startCarousel();
    },
    created(){
        
    },
    methods:{
        startCarousel(){
            this.intervalId = setInterval(()=>
        {
            this.nextImg();
        } ,this.intervalDuration);
        },
        nextImg(){
            this.currentImg = (this.currentImg + 1) % this.carouselImg.length;
            this.$emit("currentImg", this.currentImg);
        },
        beforeDestroy(){
            clearInterval(this.intervalId);
        },
    }
}
</script>
//class="img" 類別名暫定
<template>
<div class="mainCarousel">
    <transition-group name="fade" tag="div">
        <div v-bind:key="currentImg" class="img"> 
        <img v-bind:src="carouselImg[currentImg].image">
        </div>
    </transition-group>
</div>

</template>

<style>
.mainCarousel{
    width: 100%;
    height: 80dvh;
    margin: 0 auto;
    overflow: hidden;
    position: relative;
    .img{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%)    
        }
    }
.fade-enter-active, .fade-leave-active{
    transition: opacity 0.5s, transform 0.5s;
    opacity: 1;
}
.fade-enter, .fade-leave-to{
    opacity: 0;
}

</style>