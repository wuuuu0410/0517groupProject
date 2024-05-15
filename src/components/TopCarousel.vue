<script>
export default {
    data() {
        return {

            currentImg: 0,
            intervalId: null,
            intervalDuration: 4000
        }
    },
    props: {
        carouselImg: {
            default: []
        }
    },
    mounted() {
        this.startCarousel();
    },
    created() {

    },
    methods: {
        startCarousel() {
            this.intervalId = setInterval(() => {
                this.nextImg();
            }, this.intervalDuration);
        },
        nextImg() {
            this.currentImg = (this.currentImg + 1) % this.carouselImg.length;
            this.$emit("currentImg", this.currentImg);
        },
        beforeDestroy() {
            clearInterval(this.intervalId);
        },
        prevImg() {
            this.currentImg = (this.currentImg - 1 + this.carouselImg.length) % this.carouselImg.length;
            this.$emit("currentImg", this.currentImg);
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
        <button class="previousImg" @click="prevImg"><i class="fa-solid fa-less-than"></i></button>
        <button class="NextImg" @click="nextImg"><i class="fa-solid fa-greater-than"></i></button>
    </div>

</template>

<style>
.mainCarousel {
    width: 100%;
    height: 70dvh;
    margin: 0 auto;
    overflow: hidden;
    position: relative;

    .img {
        width: 100%;
        height: 70dvh;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%)
    }

    .previousImg {
        position: absolute;
        width: 57px;
        left: 20px;
        top: 50%;
        background: #F8C3CD;
        color: white;
        border: none;
        font-size: 40px;
        border-radius: 50%;

    }

    .NextImg {
        position: absolute;
        width: 57px;
        right: 20px;
        top: 50%;
        background: #F8C3CD;
        border: none;
        color: white;
        font-size: 40px;
        border-radius: 50%;
    }

    .previousImg:hover {
        transform: scale(1.2);
    }

    .NextImg:hover {
        transform: scale(1.2);
    }

    img {
        width: 100%;
        height: 80dvh;
        object-fit: 100% 100%;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s, transform 0.5s;
    opacity: 1;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>