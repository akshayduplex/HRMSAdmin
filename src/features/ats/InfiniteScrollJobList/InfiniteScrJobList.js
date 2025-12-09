import React, { useState, useEffect, useRef } from 'react';
import { InfinitySpin } from 'react-loader-spinner';
import { useDispatch, useSelector } from 'react-redux';

function InfiniteJobList({ statusFilter, selector, actionCreator, CardComponent }) {
  const dispatch = useDispatch();

  // Grab the most recently fetched page from Redux
  const { status, data: reduxPageData } = useSelector(selector);

  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const bottomRef = useRef(null);

  // Reset when filter/tab changes
  useEffect(() => {
    setPage(1);
    setItems([]);
    setHasMore(true);
  }, [statusFilter]);

  // Fetch a page whenever `page` or `statusFilter` changes
  useEffect(() => {
    const payload = {
      keyword: "",
      department: "",
      job_title: "",
      location: "",
      job_type: "",
      salary_range: "",
      page_no: String(page),
      per_page_record: String(PAGE_SIZE),
      status: statusFilter,
      scope_fields: [
        "_id", "project_name", "department", "job_title",
        "job_type", "experience", "location", "salary_range",
        "status", "working", "deadline", "form_candidates",
        "available_vacancy", "total_vacancy", "add_date", "designation",
        ...(statusFilter === 'Published' ? ["naukari_job_data"] : [])
      ],
    };
    dispatch(actionCreator(payload));
  }, [dispatch, actionCreator, page, statusFilter]);

  // Handle new data when Redux state updates
  useEffect(() => {
    if (status === 'success') {
      setItems(prev =>
        page === 1 ? [...reduxPageData] : [...prev, ...reduxPageData]
      );
      setHasMore(reduxPageData.length === PAGE_SIZE);
    }
  }, [status, reduxPageData, page]);

  // IntersectionObserver to trigger next page
  useEffect(() => {
    if (!hasMore || status === 'loading') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPage(prev => prev + 1);
        }
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 0.1,
      }
    );

    const sentinel = bottomRef.current;
    if (sentinel) observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [hasMore, status]);

  return (
    <div className="d-flex flex-column gap-2 mt-1 scroller-content">
      {/* Initial loader */}
      {status === 'loading' && page === 1 ? (
        <div className="d-flex justify-content-center">
          <InfinitySpin visible width="200" color="#4fa94d" />
        </div>
      ) : (
        items.map(job => (
          <CardComponent key={job._id} value={job} />
        ))
      )}

      {/* Loader for next pages */}
      {status === 'loading' && page > 1 && (
        <div className="d-flex justify-content-center">
          <InfinitySpin visible width="100" color="#4fa94d" />
        </div>
      )}

      {/* Sentinel element */}
      <div ref={bottomRef} style={{ height: 1 }} />
    </div>
  );
}

export default InfiniteJobList;
