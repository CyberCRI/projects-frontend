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
            gap: 0.2cm;
            flex-flow: column nowrap;
          }

          .goal {
            --border-radius: 0.3cm;
            --border-width: 0.05cm;
            position: relative;
            background: #FFF;
            transform: scale3d(1, 1, 1);
          }

         
          .goal .content {
            display: flex;
          }
          .goal .content .left {
            writing-mode: tb-rl;
            transform: rotate(-180deg);
            background: #f0fffb;
            color: #000;
            text-align: center;
            padding:.2cm;
            box-sizing: border-box;
            font-size: .7rem;
            font-weight: 500;
            border-top-right-radius: var(--border-radius);
            border-bottom-right-radius: var(--border-radius);
            min-height: calc(8 * .7rem);
            border: var(--border-width) solid #000;
          }

          .goal.complete .left{
            border-color: #00dba7;
            background: #00dba7;
          }
          .goal.ongoing .left {
            border-color: #99ffe7;
            background: #99ffe7;
          }
          .goal.cancel .left{
            border-color: #bdbdbd;
            background: #bdbdbd;
            color: #999;
          }

          .goal .content .right {
            padding: 0.2cm 0.4cm;
            box-sizing: border-box;
            width: 20rem;
            flex-grow: 1;

            border: var(--border-width) solid #000;
            border-left: 0 none;
            border-radius: 0 var(--border-radius) var(--border-radius) 0;
          }

          .goal.complete .right{
            border-color: #00dba7;
          }
          .goal.ongoing .right {
            border-color: #99ffe7;
          }
          .goal.cancel .right{
            border-color: #bdbdbd;
          }

          .goal .content .right .main-content {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: flex-start;
          }
          .goal .content .right .main-content p {
            margin: 0;
          }
          .goal .content .right .main-content .goal-title {
            font-size: 1.2rem;
            font-weight: 900;
          }
          .goal .content .right .main-content .goal-deadline {
            font-size: 1rem;
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
            <div class="goal shadow-box  ${goal.status}"">
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
