'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { Send, User as UserIcon, Loader2, MessageSquare } from 'lucide-react';
import Image from 'next/image';

interface CommentUser {
    id: number;
    username: string;
    avatarUrl: string | null;
}

interface Comment {
    id: number;
    content: string;
    createdAt: string;
    user: CommentUser;
}

export function CommentsSection({ animeId }: { animeId: string }) {
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchComments = async () => {
        try {
            const res = await fetch(`/api/comments?animeId=${animeId}`);
            if (res.ok) {
                const data = await res.json();
                setComments(data.comments);
            }
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [animeId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ animeId, content: newComment.trim() })
            });

            if (res.ok) {
                setNewComment('');
                fetchComments(); // Reload to get the new comment with user data
            }
        } catch (error) {
            console.error('Failed to post comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
        );
    }

    return (
        <div className="w-full space-y-8 bg-surface border-4 border-bg-dark p-6 shadow-[8px_8px_0_var(--color-bg-dark)]">
            <div className="flex items-center gap-3 border-b-2 border-bg-dark pb-4">
                <MessageSquare className="w-6 h-6 text-accent" />
                <h3 className="font-editorial text-2xl uppercase tracking-widest text-bg-dark">Комментарии ({comments.length})</h3>
            </div>

            {/* Comment Form */}
            {user ? (
                <form onSubmit={handleSubmit} className="flex gap-4">
                    <div className="w-12 h-12 shrink-0 border-2 border-bg-dark bg-accent overflow-hidden shadow-[2px_2px_0_var(--color-bg-dark)]">
                        {user.avatarUrl ? (
                            <Image src={user.avatarUrl} alt={user.username} width={48} height={48} className="w-full h-full object-cover mix-blend-multiply grayscale" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center font-editorial text-2xl text-cream">
                                {user.username[0].toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 relative">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Оставьте свой комментарий..."
                            className="w-full min-h-[100px] p-4 bg-white border-2 border-bg-dark text-bg-dark font-medium placeholder-bg-dark/40 resize-none outline-none focus:border-accent shadow-[4px_4px_0_var(--color-bg-dark)] transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting || !newComment.trim()}
                            className="absolute bottom-4 right-4 p-2 bg-accent text-white border-2 border-bg-dark shadow-[2px_2px_0_var(--color-bg-dark)] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5 disabled:opacity-50 transition-all outline-none"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="p-6 bg-white border-2 border-bg-dark shadow-[4px_4px_0_var(--color-bg-dark)] text-center">
                    <p className="font-black uppercase tracking-widest text-bg-dark mb-2">Хотите оставить комментарий?</p>
                    <p className="text-sm text-bg-dark/60 font-medium tracking-wide">Войдите в свой аккаунт, чтобы присоединиться к обсуждению.</p>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-6 pt-4">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                        <div className="w-10 h-10 shrink-0 border-2 border-bg-dark bg-white overflow-hidden shadow-[2px_2px_0_var(--color-bg-dark)]">
                            {comment.user.avatarUrl ? (
                                <Image src={comment.user.avatarUrl} alt={comment.user.username} width={40} height={40} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center font-editorial text-xl text-bg-dark">
                                    {comment.user.username[0].toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-baseline gap-2">
                                <span className="font-black uppercase tracking-widest text-bg-dark">{comment.user.username}</span>
                                <span className="text-xs font-bold text-bg-dark/40 tracking-wider">
                                    {new Date(comment.createdAt).toLocaleDateString('ru-RU')}
                                </span>
                            </div>
                            <p className="text-bg-dark/80 font-medium leading-relaxed whitespace-pre-wrap">
                                {comment.content}
                            </p>
                        </div>
                    </div>
                ))}

                {comments.length === 0 && (
                    <div className="text-center py-8 text-bg-dark/40 font-bold uppercase tracking-widest border-2 border-dashed border-bg-dark/20">
                        Пока нет комментариев. Будьте первыми!
                    </div>
                )}
            </div>
        </div>
    );
}
