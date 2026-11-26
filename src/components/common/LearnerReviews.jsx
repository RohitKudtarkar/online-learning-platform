import { useState } from 'react';
import { Star, MessageSquarePlus, AlertTriangle } from 'lucide-react';
import Button from '../common/Button';

export default function LearnerReviews({ initialReviews = [], defaultName = '' }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [authorName, setAuthorName] = useState(defaultName);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanName = authorName.trim();
    const cleanComment = comment.trim();

    if (!cleanName || !cleanComment) {
      setError('Please enter both your name and your review.');
      return;
    }
    if (cleanComment.length < 10) {
      setError('Review must be at least 10 characters long.');
      return;
    }

    setError('');
    setReviews((prev) => [
      {
        id: Date.now(),
        authorName: cleanName,
        rating,
        comment: cleanComment,
        date: new Date().toLocaleDateString(),
      },
      ...prev,
    ]);
    setComment('');
    setRating(5);
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm"
      >
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquarePlus className="w-5 h-5 text-emerald-600" />
            <span>Write a Learner Review</span>
          </h3>

          <div className="flex items-center gap-1" role="group" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1 cursor-pointer"
                aria-label={`${star} star${star > 1 ? 's' : ''}`}
              >
                <Star
                  className={`w-5 h-5 ${
                    star <= rating
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-300 dark:text-slate-600'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <input
          type="text"
          value={authorName}
          onChange={(e) => {
            setAuthorName(e.target.value);
            if (error) setError('');
          }}
          placeholder="Your name"
          className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
        />

        <textarea
          rows={3}
          maxLength={300}
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            if (error) setError('');
          }}
          placeholder="Share what you learned, pacing, or practical takeaways..."
          className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600 resize-none"
        />

        {error && (
          <p className="text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
          >
            Submit Review
          </Button>
        </div>
      </form>

      <div className="space-y-3">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 space-y-2 shadow-2xs"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                {rev.authorName}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {rev.rating} ★ · {rev.date}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {rev.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}