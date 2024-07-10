import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

import React from "react";
export const queryClient = new QueryClient();
export function SupabaseProvider({ children }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
}

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/* supabase integration types

### design_partners

| name       | type        | format | required |
|------------|-------------|--------|----------|
| id         | int8        | number | true     |
| name       | text        | string | true     |
| email      | text        | string | true     |
| stage      | text        | string | true     |
| created_at | timestamptz | string | true     |

*/

// Hooks for design_partners table

export const useDesignPartners = () => useQuery({
    queryKey: ['design_partners'],
    queryFn: () => fromSupabase(supabase.from('design_partners').select('*'))
});

export const useDesignPartner = (id) => useQuery({
    queryKey: ['design_partners', id],
    queryFn: () => fromSupabase(supabase.from('design_partners').select('*').eq('id', id).single())
});

export const useAddDesignPartner = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newPartner) => fromSupabase(supabase.from('design_partners').insert([newPartner])),
        onSuccess: () => {
            queryClient.invalidateQueries('design_partners');
        },
    });
};

export const useUpdateDesignPartner = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('design_partners').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('design_partners');
        },
    });
};

export const useDeleteDesignPartner = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('design_partners').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('design_partners');
        },
    });
};