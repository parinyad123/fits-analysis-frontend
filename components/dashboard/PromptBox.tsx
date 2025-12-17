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
import { Plus, Send, FileText, X, Upload } from 'lucide-react';
import type { ExpertiseLevel } from '@/lib/types';
import { toast } from 'sonner';

interface PromptBoxProps {
    onSubmit: (message: string, fileId: string, expertise: ExpertiseLevel) => void;
    disabled?: boolean;
}

export function PromptBox({ onSubmit, disabled = false }: PromptBoxProps) {
    const [message, setMessage] = useState('');
    const [selectedFileId, setSelectedFileId] = useState<string>('');
    const [expertise, setExpertise] = useState<ExpertiseLevel>('advanced');
    const [fileDialogOpen, setFileDialogOpen] = useState(false);

    const { files, uploadFile, isUploading } = useFiles();

    const selectedFile = files.find((f) => f.file_id === selectedFileId);

    const handleSubmit = () => {
        if (!message.trim()) {
            toast.error('Please enter a message');
            return;
        }
        if (!selectedFileId) {
            toast.error('Please select a FITS file');
            return;
        }

        onSubmit(message.trim(), selectedFileId, expertise);
        setMessage('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleFileSelect = (fileId: string) => {
        setSelectedFileId(fileId);
        setFileDialogOpen(false);
        toast.success('File selected');
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        uploadFile(file);
        e.target.value = '';
    };

    return (
        // ✅ ไม่ใช้ absolute - ใช้ normal flow
        <div className='w-full bg-[#0f0f0f]  p-0'>
            <div className='max-w-4xl mx-auto'>
                {/* Main Input Box */}
                <div className='bg-gray-900 rounded-3xl border border-gray-700 shadow-2xl overflow-hidden'>
                    {/* Textarea */}
                    <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder='Ask about your FITS file analysis...'
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
                                <DialogContent className='max-w-2xl'>
                                    <DialogHeader>
                                        <DialogTitle>Select FITS File</DialogTitle>
                                        <DialogDescription>
                                            Choose an existing file or upload a new FITS file for analysis
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className='space-y-4'>
                                        {/* Upload New File */}
                                        <div className='border-2 border-dashed border-gray-700 rounded-lg p-8 text-center'>
                                            <input
                                                type='file'
                                                accept='.fits,.fit'
                                                onChange={handleFileUpload}
                                                disabled={isUploading}
                                                className='hidden'
                                                id='file-upload'
                                            />
                                            <label htmlFor='file-upload' className='cursor-pointer'>
                                                <Upload className='h-12 w-12 mx-auto mb-4 text-gray-500' />
                                                <p className='text-sm text-gray-400'>
                                                    Click to upload FITS file
                                                </p>
                                            </label>
                                        </div>

                                        {/* Existing Files */}
                                        <div className='space-y-2 max-h-80 overflow-y-auto'>
                                            {files.map((file) => (
                                                <button
                                                    key={file.file_id}
                                                    onClick={() => handleFileSelect(file.file_id)}
                                                    className='w-full flex items-center gap-3 p-3 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors text-left'
                                                >
                                                    <FileText className='h-5 w-5 text-violet-500' />
                                                    <div className='flex-1 min-w-0'>
                                                        <p className='text-sm font-medium text-white truncate'>
                                                            {file.original_filename}
                                                        </p>
                                                        <p className='text-xs text-gray-500'>
                                                            {(file.file_size / 1024 / 1024).toFixed(2)} MB
                                                        </p>
                                                    </div>
                                                </button>
                                            ))}
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
                                    >
                                        <X className='h-3 w-3' />
                                    </Button>
                                </div>
                            )}
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
                                disabled={!message.trim() || !selectedFileId || disabled}
                                size='icon'
                                className='h-9 w-9 rounded-full'
                            >
                                <Send className='h-5 w-5' />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Helper Text */}
                <p className='text-xs text-gray-500 text-center my-0 py-2'>
                    Press Enter to send, Shift + Enter for new line
                </p>
            </div>
        </div>
    );
}