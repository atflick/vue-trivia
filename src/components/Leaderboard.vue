<template>
  <div class="leaderboard">
    <ol>
      <li v-for="team in teams" :key="team.id">
        {{ team.name }}
        {{ team.score }}
      </li>
    </ol>
  </div>
</template>

<script>
export default {
  name: 'Leaderboard',
  props: ['teams']
}
</script>

<style lang="scss">

</style>
