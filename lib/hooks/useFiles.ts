/*
lib/hooks/useFiles.ts

Files Hook with React Query
 */

// import { useQuery, useMutation, useQueryClient, queryClient } from '@tanstack/react-query';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { filesApi } from '@/lib/api/files.api';
import type { PaginationParams } from '@/lib/types';
import { toast } from 'sonner';

export function useFiles(params?: PaginationParams) {
    const queryClient = useQueryClient();

    // ==========================================
    // Get files query
    // ==========================================
    const filesQuery = useQuery({
        queryKey: ['files', params],
        queryFn: () => filesApi.getFiles(params),
    });

    // ==========================================
    // Upload file mutation
    // ==========================================
    const uploadMutation = useMutation({
        mutationFn: filesApi.uploadFile,
        // Refresh callback
        onSuccess: (data) => {
            // Refresh files list
            queryClient.invalidateQueries({ queryKey: ['files'] });

            // Show success/warning toast
            if (data.is_valid) {
                toast.success(`File uploaded: ${data.original_filename}`);
            } else {
                toast.warning(`File uploaded but validation failed: ${data.validation_error}`)
            }
        },

        // Error callback
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || 'upload failed');
        },
    });

    // ==========================================
    // DELETE FILE MUTATION
    // ==========================================
    const deleteMutation = useMutation({
        mutationFn: filesApi.deleteFile,

        // Success callback
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['files'] });
            toast.success('File deleted successfully');
        },

        // Error callback
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || 'Delete failed');
        },
    });

    // ==========================================
    // RETURN VALUES
    // ==========================================
    return {
        // Data
        files: filesQuery.data?.files || [],    // Array of files

        // Loading 
        isLoading: filesQuery.isLoading,        // Initial loading
        isIploading: uploadMutation.isPending,  // upload in progress
        isDeleting: deleteMutation.isPending,   // Delete in progress

        // Actions
        uploadFile: uploadMutation.mutate,      // upload functin                   
        deleteFile: deleteMutation.mutate,      // delete function
        refetch: filesQuery.refetch,            // manuak refresh

        // Pagination info
        hasMore: filesQuery.data?.has_more || false,
        nextOffset: filesQuery.data?.next_offset,
        total: filesQuery.data?.total || 0,
    };


}