export default function usePage404() {
  const router = useRouter()
  const route = useRoute()
  router.replace({
    name: 'page404',
    params: { pathMatch: route.path.substring(1).split('/') },
  })
}
