// https://github.com/nuxt/nuxt/issues/14195
import { defineNitroPlugin } from 'nitropack/dist/runtime/plugin'
import { useRuntimeConfig } from '#imports'

export default defineNitroPlugin((nitroApp) => {
  const runtimeConfig = useRuntimeConfig()
  nitroApp.hooks.hook('render:html', (html /*, { event }*/) => {
    html.head.push(
      `<style>
            body {
                margin: 0;
                padding: 0;
            }

            .app-loader {
                height: 100vh;
                width: 100vw;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                transition: opacity 0.2s;
            }

            .app-loader.fade-out {
                opacity: 0;
            }

            .app-version {
                position: absolute;
                bottom: 1rem;
                right: 1rem;
                font-size: 0.8rem;
            }

            .app-loader svg {
                width: min(75vw, 75vh);
            }

            @keyframes app-loader-pulse {
                0%,
                10% {
                    transform: translateZ(0) scale(1);
                    opacity: 0.5;
                }

                90%,
                100% {
                    transform: translateZ(0) scale(1.05);
                    opacity: 1;
                }
            }

            .app-loader svg path {
                animation: app-loader-pulse 1200ms ease-in-out infinite alternate;
                transform-origin: center center;
            }

            .app-loader svg .trunk {
                animation-delay: 0ms;
            }

            .app-loader svg .left-leaf {
                animation-delay: -900ms;
            }

            .app-loader svg .top-leaf {
                animation-delay: -600ms;
            }

            .app-loader svg .right-leaf {
                animation-delay: -300ms;
            }
        </style>        
        `
    )

    // TODO: remove ?
    html.htmlAttrs.push("data-theme='light'")

    html.body = [
      `<div class="app-loader">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -5 42 41" fill="none">
                        <path
                            class="left-leaf"
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M7.38462 6.70508H6.5641C2.93885 6.70508 0 9.64393 0 13.2692L0 18.1923C0 21.8175 2.93885 24.7564 6.5641 24.7564H11.4872C14.5458 24.7564 17.1158 22.6644 17.8445 19.8333H15.1422C10.8578 19.8333 7.38462 16.3601 7.38462 12.0757L7.38462 6.70508Z"
                            fill="#FF9473"
                        />
                        <path
                            class="right-leaf"
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M21.3333 19.8246V20.0562C21.3333 22.1984 23.0699 23.9349 25.2121 23.9349H28.1212C30.2634 23.9349 32 22.1984 32 20.0562V17.1471C32 15.1745 30.5276 13.5459 28.6219 13.3003C28.0537 16.8832 25.0327 19.6495 21.3333 19.8246Z"
                            fill="#6CD5FF"
                        />
                        <path
                            class="trunk"
                            d="M15.5897 26.8449C15.5897 25.6914 16.5248 24.7563 17.6783 24.7563H19.2447C20.3982 24.7563 21.3333 25.6914 21.3333 26.8449V28.4114C21.3333 29.5648 20.3982 30.4999 19.2447 30.4999H17.6783C16.5248 30.4999 15.5897 29.5648 15.5897 28.4114V26.8449Z"
                            fill="#D6A2FF"
                        />
                        <path
                            class="top-leaf"
                            d="M9.02563 6.70522C9.02563 3.07996 11.9645 0.141113 15.5897 0.141113L20.5128 0.141113C24.1381 0.141113 27.0769 3.07996 27.0769 6.70522L27.0769 11.6283C27.0769 15.2535 24.1381 18.1924 20.5128 18.1924H15.5897C11.9645 18.1924 9.02563 15.2535 9.02563 11.6283V6.70522Z"
                            fill="#00DBA7"
                        />
                    </svg>
                    <span class="app-version">${runtimeConfig.public.appVersion}</span>
                </div>`,
      `<div id="__nuxt"></div>`,
      // ---
      '<div id="teleports"></div>',
    ]
    html.bodyAttrs.push("data-theme='light'")
  })
})
