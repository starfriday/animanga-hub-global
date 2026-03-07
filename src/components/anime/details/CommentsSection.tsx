import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { Send, User as UserIcon, Loader2, ShieldAlert } from 'lucide-react';
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
            <div className="w-full flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="w-10 h-10 text-accent animate-spin" strokeWidth={1} />
                <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-20">Fetching.Data.Stream</p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-12">
            {/* SYS.LOG Submission Header */}
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <div className="h-4 w-4 bg-accent animate-pulse border-2 border-bg-dark" />
                    <h3 className="text-xl md:text-2xl font-editorial uppercase tracking-widest text-bg-dark flex items-center gap-4 italic font-bold">
                        Command.Input
                        <span className="text-[10px] font-black not-italic opacity-20 font-mono tracking-widest">[ USER.FEED ]</span>
                    </h3>
                </div>

                {user ? (
                    <form onSubmit={handleSubmit} className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity blur-sm pointer-events-none" />
                        <div className="relative bg-white border-[3px] border-bg-dark shadow-[12px_12px_0_var(--color-bg-dark)] p-1 overflow-hidden">
                            {/* Terminal prompt symbol */}
                            <div className="absolute top-4 left-4 text-accent font-black select-none opacity-40">&gt;</div>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Awaiting Input... (Sys.Log Entry)"
                                className="w-full min-h-[120px] p-4 pl-10 bg-transparent text-bg-dark font-mono text-sm placeholder:opacity-20 resize-none outline-none focus:ring-0"
                            />

                            <div className="flex items-center justify-between p-3 bg-bg-dark text-white border-t-[3px] border-bg-dark">
                                <div className="flex items-center gap-3 opacity-40">
                                    <UserIcon size={12} className="text-accent" />
                                    <span className="text-[10px] font-black uppercase tracking-widest font-mono">{user.username}#LOG</span>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !newComment.trim()}
                                    className="px-6 py-2 bg-accent text-white group/btn flex items-center gap-3 hover:bg-white hover:text-bg-dark transition-all disabled:opacity-30 outline-none"
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Execute.Commit</span>
                                    {isSubmitting ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} className="group-hover/btn:translate-x-1 transition-transform" />}
                                </button>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="p-8 bg-bg-dark text-white border-[3px] border-bg-dark shadow-[12px_12px_0_rgba(0,0,0,0.1)] text-center space-y-4">
                        <div className="text-accent mx-auto animate-pulse"><ShieldAlert size={32} /></div>
                        <div className="space-y-1">
                            <p className="font-black uppercase tracking-[0.3em] text-sm">Authorization.Required</p>
                            <p className="text-[10px] font-mono opacity-40 uppercase">User.Auth.Token: NULL // Access Denied</p>
                        </div>
                    </div>
                )}
            </div>

            {/* SYSLOG ENTRIES */}
            <div className="space-y-6">
                <div className="text-[10px] font-mono opacity-20 uppercase tracking-[0.5em] mb-4 border-b border-bg-dark/5 pb-2">
                    Entrypool Stream // Count: {comments.length}
                </div>

                <div className="space-y-6">
                    {comments.map((comment, idx) => (
                        <div key={comment.id} className="group relative">
                            {/* Vertical line connector */}
                            {idx < comments.length - 1 && (
                                <div className="absolute left-[23px] top-12 bottom-[-1.5rem] w-[2px] bg-bg-dark/5" />
                            )}

                            <div className="flex gap-6">
                                <div className="relative z-10 w-12 h-12 md:w-14 md:h-14 shrink-0 border-[3px] border-bg-dark bg-white shadow-[4px_4px_0_var(--color-bg-dark)] overflow-hidden">
                                    <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 animate-scan z-10 pointer-events-none" />
                                    {comment.user.avatarUrl ? (
                                        <Image src={comment.user.avatarUrl} alt={comment.user.username} width={56} height={56} className="w-full h-full object-cover grayscale mix-blend-multiply group-hover:grayscale-0 transition-all duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center font-editorial text-2xl text-bg-dark/20 uppercase">
                                            {comment.user.username[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 space-y-3 pt-1">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-editorial text-lg md:text-xl uppercase tracking-tighter text-bg-dark italic group-hover:text-accent transition-colors leading-none">
                                                {comment.user.username}
                                            </span>
                                            <span className="text-[8px] font-mono opacity-20 tracking-tighter">[ UID: {comment.user.id} ]</span>
                                        </div>
                                        <div className="h-[2px] flex-1 bg-bg-dark/5" />
                                        <span className="text-[9px] font-mono text-bg-dark/30 tracking-widest font-black uppercase">
                                            {new Date(comment.createdAt).toLocaleString('ru-RU', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className="bg-white border border-bg-dark/5 p-4 md:p-6 shadow-sm group-hover:border-bg-dark/10 transition-colors">
                                        <p className="text-bg-dark/80 font-medium leading-relaxed tracking-wide whitespace-pre-wrap text-[13px] md:text-sm">
                                            {comment.content}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4 text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-20 transition-opacity">
                                        <button className="hover:text-accent">Respond</button>
                                        <button className="hover:text-accent">Flag</button>
                                        <button className="hover:text-accent italic">Log_ID: {comment.id}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {comments.length === 0 && (
                        <div className="py-20 text-center space-y-4 border-2 border-dashed border-bg-dark/10 bg-bg-cream/20">
                            <div className="text-bg-dark/10 font-black uppercase tracking-[1em] text-2xl">Buffer.Empty</div>
                            <p className="text-[9px] font-mono text-bg-dark/30 uppercase">System Error 404: No Community Log Found // Awaiting First Commit</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
