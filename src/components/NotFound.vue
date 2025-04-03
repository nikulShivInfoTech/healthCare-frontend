<template>
    <div class="not-found parallax" @mousemove="handleParallax" @mouseleave="stopParallax">
        <div class="sky-bg"></div>
        <div class="wave-7"></div>
        <div class="wave-6"></div>
        <a class="wave-island" href="/">
            <img src="http://res.cloudinary.com/andrewhani/image/upload/v1524501929/404/island.svg" alt="Island" />
        </a>
        <div class="wave-5"></div>
        <div class="wave-lost wrp">
            <span>4</span>
            <span>0</span>
            <span>4</span>
        </div>
        <div class="wave-4"></div>
        <div class="wave-boat">
            <img class="boat" src="http://res.cloudinary.com/andrewhani/image/upload/v1524501894/404/boat.svg"
                alt="Boat" />
        </div>
        <div class="wave-3"></div>
        <div class="wave-2"></div>
        <div class="wave-1"></div>
        <div class="wave-message">
            <p>You're lost</p>
            <p>Click on the island to return</p>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";

const handleParallax = (event) => {
    const windowWidth = window.innerWidth;
    if (windowWidth < 768) return;

    const parallaxContainer = document.querySelector(".parallax");
    const halfFieldWidth = parallaxContainer.offsetWidth / 2;
    const halfFieldHeight = parallaxContainer.offsetHeight / 2;
    const fieldPos = parallaxContainer.getBoundingClientRect();

    const x = event.pageX;
    const y = event.pageY - fieldPos.top;
    const newX = (x - halfFieldWidth) / 30;
    const newY = (y - halfFieldHeight) / 30;

    parallaxContainer.querySelectorAll('[class*="wave"]').forEach((wave, index) => {
        wave.style.transition = "";
        wave.style.transform = `translate3d(${index * newX}px, ${index * newY}px, 0px)`;
    });
};

const stopParallax = () => {
    const waves = document.querySelectorAll('[class*="wave"]');
    waves.forEach((wave) => {
        wave.style.transform = "translate(0px, 0px)";
        wave.style.transition = "all .7s";
    });

    setTimeout(() => {
        waves.forEach((wave) => (wave.style.transition = ""));
    }, 700);
};
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css?family=Open+Sans|PT+Sans+Narrow');

body {
    overflow: hidden;
    font-family: 'Open Sans', sans-serif;
}

.not-found {
    position: relative;
    overflow: hidden;
    margin: 0 -20vw;
    height: 110vh;

    [class*="wave"] {
        position: absolute;
    }

    div {
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;

        &.sky-bg {
            background: url(http://res.cloudinary.com/andrewhani/image/upload/v1524821915/404/bg-1_gvybzk.svg);
            height: 100%;
        }

        @for $i from 1 through 7 {
            &.wave-#{$i} {
                background: url(http://res.cloudinary.com/andrewhani/image/upload/v1524501869/404/wave-#{$i}.svg);
            }
        }

        &[class*="wave"]:not(.wave-4) {
            height: calc(100% - 250px);
        }

        &.wave-4 {
            height: calc(100% - 430px);
        }
    }

    .boat {
        position: absolute;
        top: 0;
        right: 15%;
        width: 150px;
        animation: boat 15s cubic-bezier(0.65, 0.05, 0.36, 1) infinite;
    }

    .wave-lost {
        position: absolute;
        top: 20%;
        left: 50%;
        color: #fff;
        font-size: 20rem;
        animation: surf 2s;

        span {
            float: left;
            animation: float 3s ease-in infinite;

            &:nth-child(2) {
                animation-delay: 2.5s;
            }

            &:nth-child(3) {
                animation-delay: 4.5s;
            }
        }
    }

    .wave-island {
        position: absolute;
        top: 130px;
        left: 20%;
        padding: 10px;
        width: 170px;
    }

    .wave-message {
        position: absolute;
        bottom: 100px;
        left: 50%;
        padding-right: 50%;
        height: auto !important;
        color: #fff;
        font-size: 3rem;
        text-align: left;
        animation: wave-message 1s;
    }
}

@keyframes boat {
    0% {
        transform-origin: left;
        transform: rotate(-15deg) translate3d(400px, 0px, 0px);
    }

    20% {
        transform-origin: left;
        transform: rotate(15deg) translate3d(-20vw, 0, 0px);
    }

    25% {
        transform-origin: left;
        transform: rotate(-7deg) translate3d(-25vw, 0, 0px);
    }

    50% {
        transform-origin: left;
        transform: rotate(5deg) translate3d(-50vw, 0, 0px);
    }

    60% {
        transform-origin: left;
        transform: rotate(-1deg) translate3d(-60vw, 0, 0px);
    }

    100% {
        transform-origin: left;
        transform: rotate(2deg) translate3d(-100vw, 0, 0px);
    }
}

@keyframes float {

    0%,
    100% {
        transform: rotate(3deg) translate3d(0px, -10px, 0px);
    }

    50% {
        transform: rotate(-3deg) translate3d(0px, 10px, 0px);
    }
}

@keyframes surf {
    0% {
        transform-origin: right;
        transform: rotate(15deg) translate3d(0, 800px, 0);
    }

    30% {
        transform-origin: right;
        transform: rotate(15deg) translate3d(0, 500px, 0);
    }

    100% {
        transform-origin: right;
        transform: rotate(0) translate3d(0, 0, 0px);
    }
}

@keyframes wave-message {
    0% {
        transform: translate3d(0, 120%, 0);
    }

    100% {
        transform: translate3d(0, 0, 0);
    }
}
</style>