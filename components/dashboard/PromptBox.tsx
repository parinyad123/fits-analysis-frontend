// components/dashboard/PromptBox.tsx

'use client';

import { useState } from 'react';
import { useFiles } from '@/lib/hooks/useFiles';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Plus, Send, FileText, X, Upload, Loader2 } from 'lucide-react';
import type { ExpertiseLevel } from '@/lib/types';
import { toast } from 'sonner';

interface PromptBoxProps {
    onSubmit: (message: string, fileId: string | null, expertise: ExpertiseLevel) => void;
    disabled?: boolean;
    isAnalyzing?: boolean;
}

export function PromptBox({ onSubmit, disabled = false, isAnalyzing = false }: PromptBoxProps) {
    const [message, setMessage] = useState('');
    const [selectedFileId, setSelectedFileId] = useState<string>('');
    const [expertise, setExpertise] = useState<ExpertiseLevel>('advanced');
    const [fileDialogOpen, setFileDialogOpen] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const { files, uploadFile, isUploading } = useFiles();

    const selectedFile = files.find((f) => f.file_id === selectedFileId);

    const handleSubmit = () => {
        if (!message.trim()) {
            toast.error('Please enter a message');
            return;
        }

        onSubmit(message.trim(), selectedFileId || null, expertise);
        setMessage('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!isAnalyzing) {
                handleSubmit();
            }
        }
    };

    const handleFileSelect = (fileId: string) => {
        setSelectedFileId(fileId);
        setFileDialogOpen(false);
        toast.success('File selected');
    };

    // const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0];
    //     if (!file) return;

    //     uploadFile(file);
    //     e.target.value = '';
    // };

    const handleFileUpload = async (file: File) => {
        if (!file) return;

        if (!file.name.toLowerCase().endsWith('.fits') && !file.name.toLowerCase().endsWith('.fit')) {
            toast.error('Please upload a FITS file');
            return;
        }

        try {
            await uploadFile(file);
        } catch (error) {
            // Error handled by useFiles hook
        }
    };

    // Drag & Drop handlers
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        // Less than 1 minute
        if (diffMins < 1) return 'Just now';
        
        // Less than 1 hour
        if (diffMins < 60) return `${diffMins}m ago`;
        
        // Less than 24 hours
        if (diffHours < 24) return `${diffHours}h ago`;
        
        // Less than 7 days
        if (diffDays < 7) return `${diffDays}d ago`;
        
        // 7 days or more - show full date
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            // hour: '2-digit',
            // minute: '2-digit'
        });
    };

    // Format file size
    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className='w-full bg-[#0f0f0f]  p-0'>
            <div className='max-w-3xl mx-auto'>
                {/* Main Input Box */}
                <div className='bg-gray-900 rounded-3xl border border-gray-700 shadow-2xl overflow-hidden'>
                    {/* Textarea */}
                    <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder='Ask about your FITS file analysis or general astronomy questions...'
                        disabled={disabled}
                        style={{ backgroundColor: 'transparent' }}
                        className='min-h-[60px] resize-none border-0 bg-transparent px-6 py-4 text-base focus-visible:ring-0 focus-visible:ring-offset-0'
                    />

                    {/* Bottom Bar */}
                    <div className='flex items-center justify-between px-4 py-2'>
                        {/* Left Side - File Selection */}
                        <div className='flex items-center gap-2'>
                            {/* Add File Button */}
                            <Dialog open={fileDialogOpen} onOpenChange={setFileDialogOpen}>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant='ghost'
                                                    size='icon'
                                                    className='h-9 w-9 text-gray-400 hover:text-white'
                                                    disabled={disabled}
                                                >
                                                    <Plus className='h-5 w-5' />
                                                </Button>
                                            </DialogTrigger>
                                        </TooltipTrigger>
                                        <TooltipContent side='bottom'>
                                            <p>Add FITS file</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <DialogContent className='max-w-2xl'>
                                    <DialogHeader>
                                        <DialogTitle>Select FITS File</DialogTitle>
                                        <DialogDescription>
                                            Choose an existing file or upload a new FITS file for analysis
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className='space-y-4'>
                                        {/* Upload New File with Drag & Drop */}
                                        <div
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                            className={`
                                                border-2 border-dashed rounded-lg p-8 text-center transition
                                                ${dragActive
                                                    ? 'border-violet-500 bg-violet-500/10'
                                                    : 'border-gray-700 hover:border-gray-600'
                                                }
                                                ${isUploading  ? 'opacity-50 pointer-events-none' : ''}
                                            `}>
                                            <input
                                                type='file'
                                                accept='.fits,.fit'
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleFileUpload(file);
                                                    e.target.value = '';
                                                }}
                                                disabled={isUploading}
                                                className='hidden'
                                                id='file-upload'
                                            />
                                            <label htmlFor='file-upload' className='cursor-pointer'>
                                                {isUploading ? (
                                                    // Circular Loading Spinner
                                                    <div className='flex flex-col items-center gap-3'>
                                                        <Loader2 className='h-12 w-12 text-violet-500 animate-spin' />
                                                        <p className='text-sm text-gray-300 font-medium'>
                                                            Uploading file...
                                                        </p>
                                                        <p className='text-xs text-gray-500'>
                                                            Please wait
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Upload className='h-12 w-12 mx-auto mb-4 text-gray-500' />
                                                        <p className='text-sm text-gray-300'>
                                                            <span className='text-violet-500 hover:text-violet-400'>
                                                                Click to upload
                                                            </span>
                                                            {' '}or drag and drop
                                                        </p>
                                                        <p className='text-xs text-gray-500 mt-1'>FITS files only</p>
                                                    </>
                                                )}
                                            </label>
                                        </div>

                                        {/* Existing Files with Upload Time */}
                                        <div className='space-y-2 max-h-80 overflow-y-auto'>
                                            {files.length === 0 ? (
                                                <div className='text-center py-8 text-gray-500'>
                                                    No files uploaded yet
                                                </div>
                                            ) : (
                                                files.map((file) => (
                                                    <button
                                                        key={file.file_id}
                                                        onClick={() => handleFileSelect(file.file_id)}
                                                        className='w-full flex items-center gap-3 p-3 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors text-left'
                                                    >
                                                        <FileText className='h-5 w-5 text-violet-500 flex-shrink-0' />
                                                        <div className='flex-1 min-w-0'>
                                                            <p className='text-sm font-medium text-white truncate'>
                                                                {file.original_filename}
                                                            </p>
                                                            {/* Size + Upload Time */}
                                                            <div className='flex items-center gap-2 mt-0.5'>
                                                                <p className='text-xs text-gray-500'>
                                                                    {formatFileSize(file.file_size)}
                                                                </p>
                                                                <span className='text-gray-700'>•</span>
                                                                <p className='text-xs text-gray-500'>
                                                                    {formatDate(file.uploaded_at)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>

                            {/* Selected File Display */}
                            {selectedFile && (
                                <div className='flex items-center gap-2 bg-gray-700 rounded-full px-3 py-1.5'>
                                    <FileText className='h-4 w-4 text-violet-400' />
                                    <span className='text-sm text-gray-200 max-w-[200px] truncate'>
                                        {selectedFile.original_filename}
                                    </span>
                                    <Button
                                        variant='ghost'
                                        size='icon'
                                        className='h-5 w-5 hover:bg-gray-600'
                                        onClick={() => setSelectedFileId('')}
                                        // disabled={isAnalyzing}
                                    >
                                        <X className='h-3 w-3' />
                                    </Button>
                                </div>
                            )}

                            {/* show hint If these is not FITS file */}
                            {/* {!selectedFile && (
                                <span className='yexy-xs text-slate-400'>
                                    No file selected (optional)
                                </span>
                            )} */}
                        </div>

                        {/* Right Side - Expertise & Submit */}
                        <div className='flex items-center gap-2'>
                            {/* Expertise Selector */}
                            <Select
                                value={expertise}
                                onValueChange={(value) => setExpertise(value as ExpertiseLevel)}
                                disabled={disabled}
                            >
                                <SelectTrigger className='w-[140px] h-9 border-gray-700'>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='beginner'>Beginner</SelectItem>
                                    <SelectItem value='intermediate'>Intermediate</SelectItem>
                                    <SelectItem value='advanced'>Advanced</SelectItem>
                                    <SelectItem value='expert'>Expert</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Submit Button */}
                            <Button
                                onClick={handleSubmit}
                                disabled={!message.trim() || disabled || isAnalyzing} // disable if analizing
                                size='icon'
                                className='h-9 w-9 rounded-full bg-violet-100 hover:bg-violet-400'
                            >
                                <Send className='h-5 w-5' />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Helper Text */}
                <p className='text-xs text-gray-500 text-center my-0 py-2'>
                    {isAnalyzing 
                        ? 'Thinking in progress...' 
                        : 'Press Enter to send, Shift + Enter for new line'
                    }
                </p>
            </div>
        </div>
    );
}