import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export function useSearch() {
    const router = useRouter();
    const route = useRoute();

    const searchQuery = ref(route.query.q || '');
    const previousPath = ref(route.fullPath);

    watch(searchQuery, (newQuery) => {
        const trimmed = newQuery.trim();

        if (trimmed === '') {
            if (route.path === '/search' && previousPath.value !== '/search') {
                router.replace(previousPath.value);
            }
        } else {
            if (route.path !== '/search') {
                previousPath.value = route.fullPath;
            }
            router.push({ path: '/search', query: { q: trimmed } });
        }
    });

    return {
        searchQuery
    };
}
