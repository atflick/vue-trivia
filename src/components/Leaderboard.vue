<template>
  <div class="leaderboard">
    <transition-group name="leader-list" tag="ol">
      <li v-for="team in teams" :key="team.id">
        <div class="leaderboard-team">
          {{ team.name }}
        </div>
        <div class="leaderboard-score">
          {{ team.score }}
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'Leaderboard',
  props: ['teams']
}
</script>

<style lang="scss">
  .leaderboard {

    ol {
      padding: 0;
      margin: 0;

      li {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 25px 12px 35px;
        border-bottom: 1px solid primary-color(gray, tint2);
        counter-increment: li;

        &::before {
          content: counter(li)'.';
          position: absolute;
          left: 10px;
          font-family: $header-font;
          color: primary-color(blue);
          @include rem(font-size, 22px);
          transform: translateY(-3px)
        }
      }
    }

    &-team {
      @include rem(font-size, 18px);
      word-break: break-all;
    }

    &-score {
      margin-left: 15px;
      font-family: $header-font;
      @include rem(font-size, 24px);
    }
  }

  .leader-list-move {
    transition: transform 1s;
  }
</style>
