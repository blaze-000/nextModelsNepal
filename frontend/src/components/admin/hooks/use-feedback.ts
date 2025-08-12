import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  feedbackService,
  FeedbackStatistics,
} from "@/services/feedback.service";
import { Feedback } from "@/types/admin";

export function useFeedbackStatistics() {
  const [statistics, setStatistics] = useState<FeedbackStatistics>({
    totalFeedback: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true);
      const stats = await feedbackService.getStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error("Error fetching feedback statistics:", error);
      toast.error("Failed to fetch feedback statistics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return { statistics, loading, refetch: fetchStatistics };
}

export function useFeedbackData() {
  const [feedbackData, setFeedbackData] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchFeedback = useCallback(async () => {
    try {
      setLoading(true);
      const data = await feedbackService.getFeedback();
      setFeedbackData(data);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      toast.error("Failed to fetch feedback data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  return { feedbackData, loading, refetch: fetchFeedback };
}
