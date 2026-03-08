import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { Send, User as UserIcon, Loader2, MessageSquare, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

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

    const fetchComments = useCallback(async () => {
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
    }, [animeId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

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
                fetchComments();
            }
        } catch (error) {
            console.error('Failed to post comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full flex flex-col items-center justify-center py-20 space-y-4 text-bg-dark/30">
                <Loader2 className="w-8 h-8 animate-spin" strokeWidth={2} />
                <p className="text-sm font-medium">Загрузка комментариев...</p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-10">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-bg-dark/10 pb-4">
                <MessageSquare className="w-6 h-6 text-accent" />
                <h3 className="text-2xl font-black text-bg-dark">Обсуждение</h3>
                <span className="bg-bg-dark/5 text-bg-dark/60 px-2.5 py-0.5 rounded-full text-sm font-bold ml-2">
                    {comments.length}
                </span>
            </div>

            {/* Input Area */}
            <div className="space-y-6">
                {user ? (
                    <form onSubmit={handleSubmit} className="flex gap-4">
                        {/* Current User Avatar */}
                        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-white border border-bg-dark/10 shadow-sm hidden sm:block">
                            {user.avatarUrl ? (
                                <Image src={user.avatarUrl} alt={user.username} width={48} height={48} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-bg-dark/30 font-bold uppercase cursor-default select-none">
                                    {user.username[0]}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 bg-white border border-bg-dark/10 shadow-sm rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-accent/50 focus-within:border-accent transition-all duration-300 hover:border-accent">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Оставьте свой комментарий..."
                                className="w-full min-h-[100px] p-4 bg-transparent text-bg-dark placeholder:text-bg-dark/30 resize-none outline-none text-base"
                            />

                            <div className="flex items-center justify-between p-3 bg-black/5 border-t border-bg-dark/10">
                                <div className="flex items-center gap-2 text-bg-dark/50 text-sm font-medium">
                                    <UserIcon size={16} />
                                    <span>{user.username}</span>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !newComment.trim()}
                                    className={cn(
                                        "px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all",
                                        newComment.trim()
                                            ? "bg-accent text-white hover:shadow-lg hover:shadow-accent/20"
                                            : "bg-black/5 text-bg-dark/40 cursor-not-allowed"
                                    )}
                                >
                                    <span>Отправить</span>
                                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                </button>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="flex flex-col items-center justify-center p-8 bg-white border border-bg-dark/10 shadow-sm rounded-2xl text-center space-y-4">
                        <AlertCircle className="w-12 h-12 text-accent/50" />
                        <div className="space-y-1">
                            <p className="font-bold text-bg-dark text-lg">Требуется авторизация</p>
                            <p className="text-sm text-bg-dark/50">Пожалуйста, войдите в свой аккаунт, чтобы оставить комментарий.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Comments List */}
            <div className="space-y-6 pt-4">
                {comments.length === 0 ? (
                    <div className="py-16 text-center text-bg-dark/30 bg-white rounded-2xl border border-bg-dark/10 shadow-sm border-dashed">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-bold">Здесь пока нет комментариев</p>
                        <p className="text-sm text-bg-dark/40">Станьте первым, кто поделится своим мнением!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {comments.map((comment) => (
                            <div key={comment.id} className="group flex gap-4 pr-4">
                                {/* Avatar */}
                                <div className="relative w-12 h-12 shrink-0 rounded-full border border-bg-dark/10 bg-white shadow-sm overflow-hidden">
                                    {comment.user.avatarUrl ? (
                                        <Image
                                            src={comment.user.avatarUrl}
                                            alt={comment.user.username}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xl font-bold text-bg-dark/30 uppercase cursor-default select-none">
                                            {comment.user.username[0]}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 space-y-2">
                                    <div className="bg-white border border-bg-dark/10 shadow-sm rounded-2xl rounded-tl-none p-5 hover:border-accent hover:shadow-md transition-all">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold text-base text-bg-dark">
                                                {comment.user.username}
                                            </span>
                                            <span className="text-xs text-bg-dark/40 font-medium">
                                                {new Date(comment.createdAt).toLocaleDateString('ru-RU', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-bg-dark/80 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                                            {comment.content}
                                        </p>
                                    </div>

                                    {/* Action links */}
                                    <div className="flex items-center gap-4 text-xs font-bold text-bg-dark/30 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="hover:text-bg-dark transition-colors">Ответить</button>
                                        <button className="hover:text-bg-dark transition-colors">Пожаловаться</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
