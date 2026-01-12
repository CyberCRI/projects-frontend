import { Container } from '@/composables/pdf-helpers/doc-builder'

export default function addProjectPhotoFactory(projectPhotoDataUrl: string | ArrayBuffer) {
  return function addProjectPhoto(this: Container) {
    this.styles.add(/* CSS */ `
          .project-photo {
            width: 5cm;
            height: 5cm;
            flex-basis:5cm;
            flex-shrink:0;
            flex-grow:0;
          }
          `)
    this.content.push(/* HTML */ `
      <img class="project-photo" src="${projectPhotoDataUrl}" alt="Project Image" />
    `)
  }
}
