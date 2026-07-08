<script setup lang="ts"></script>

<template>
  <div class="screen-border">
    <span class="screen-border__corner screen-border__corner--tl" />
    <span class="screen-border__corner screen-border__corner--tr" />
    <span class="screen-border__corner screen-border__corner--bl" />
    <span class="screen-border__corner screen-border__corner--br" />
    <div class="screen-border__inner">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.screen-border {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 1px solid rgba(64, 158, 255, 0.35);
}
.screen-border__inner {
  width: 100%;
  height: 100%;
}
.screen-border__corner {
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid #409eff;
}
.screen-border__corner--tl {
  top: -1px;
  left: -1px;
  border-right: none;
  border-bottom: none;
}
.screen-border__corner--tr {
  top: -1px;
  right: -1px;
  border-left: none;
  border-bottom: none;
}
.screen-border__corner--bl {
  bottom: -1px;
  left: -1px;
  border-right: none;
  border-top: none;
}
.screen-border__corner--br {
  bottom: -1px;
  right: -1px;
  border-left: none;
  border-top: none;
}
</style>
