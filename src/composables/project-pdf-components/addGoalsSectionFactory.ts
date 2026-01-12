import { Container } from '@/composables/pdf-helpers/doc-builder'

export default async function addGoalsSectionFactory(goals: any[]) {
  const { t, d } = useNuxtI18n()
  // const { getTranslatableField } = useAutoTranslate()

  return function addGoalSection(this: Container) {
    let out = ''
    const deadlineFormatted = (g) =>
      `${
        g.status === 'complete' ? t('goal.completed-on-the') : t('goal.planned-for-the')
      } ${d(new Date(g.deadline_at))}`

    if (goals.length > 0) {
      this.styles.add(/* CSS */ `
          .group-section {
            break-inside: avoid;
            break-after: auto;
          }
          .goal-list {
            margin-top: .6cm;
            display: flex;
            gap: 0.6cm;
            flex-flow: column nowrap;
          }

          .goal {
            position: relative;
            outline: 0.1cm solid #000;
            border-radius: 0.5cm;
            background: #FFF;
            transform: scale3d(1, 1, 1);
          }
          .goal.shadow-box {
            cursor: pointer;
          }
          .goal .content {
            display: flex;
            min-height: 100px;
          }
          .goal .content .left {
            writing-mode: tb-rl;
            transform: rotate(-180deg);
            background: #f0fffb;
            color: #000;
            text-align: center;
            padding: 0.4cm;
            box-sizing: border-box;
            font-size: 0.4cm;
            font-weight: 500;
            border-top-right-radius: 0.5cm;
            border-bottom-right-radius: 0.5cm;
          }
          .goal .content .left.complete {
            background: #00dba7;
          }
          .goal .content .left.ongoing {
            background: #99ffe7;
          }
          .goal .content .left.cancel {
            background: #bdbdbd;
            color: #999;
          }
          .goal .content .right {
            padding: 0.2cm 0.4cm;
            box-sizing: border-box;
            width: 20rem;
            flex-grow: 1;
          }
          .goal .content .right .main-content {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            height: 100px;
          }
          .goal .content .right .main-content p {
            margin: 0;
          }
          .goal .content .right .main-content .goal-title {
            font-size: 0.6cm;
            font-weight: 900;
          }
          .goal .content .right .main-content .goal-deadline {
            font-size: 0.5cm;
            font-weight: 400;
          }
          .goal .content .right .main-content .goal-deadline.complete {
            color: #000;
          }
          .goal .content .right .main-content .goal-deadline.ongoing {
            color: #000;
          }

          .goal-description-wrapper {
            padding-right: 2rem; // dirty fix for table overlow. TODO: fix in a cleaner way
          }
          `)
      const goalsList = goals
        .map(
          (goal) => /*HTML*/ `
          <div class="goal-ctn">
            <div class="goal shadow-box">
              <div class="content">
                <div class="left ${goal.status}">
                  ${t(`status.${goal.status}`)}
                </div>
                <div class="right">
                  <div class="main-content">
                    <p class="goal-title">
                      ${goal?.$t?.title}
                    </p>

                    <p v-if="deadlineVisible" class="goal-deadline ${goal.status}">
                      ${deadlineFormatted(goal)}
                    </p>
                  </div>

                  <div class="goal-description-wrapper">
                    ${goal?.$t?.description}
                  </div>
                </div>
              </div>
            </div>
          </div>`
        )
        .join('')

      out = /* HTML */ `
        <div class="goal-list">${goalsList}</div>
      `
    }
    this.content.push(out)
  }
}
