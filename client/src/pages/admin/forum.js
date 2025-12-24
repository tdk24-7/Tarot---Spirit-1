import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../shared/layouts/AdminLayout'
import Button from '../../shared/components/common/Button'
import Card from '../../shared/components/common/Card'
import SearchBar from '../../shared/components/common/SearchBar'
import Icon from '../../shared/components/common/Icon'
import Spinner from '../../shared/components/common/Spinner'
import { format, parseISO } from 'date-fns'

// Mock data for forum posts
const MOCK_FORUM_POSTS = [
  {
    id: 1,
    title: 'Understanding the Symbolism of The Fool',
    content: 'The Fool is often misunderstood as someone who lacks wisdom, but I believe the card represents...',
    author: {
      id: 101,
      name: 'Nguyen Van A',
      avatar: '',
      isPremium: true
    },
    category: 'Major Arcana',
    status: 'published',
    publishedAt: '2023-11-10T15:30:00',
    commentsCount: 12,
    likesCount: 28,
    viewsCount: 152,
    reportedCount: 0,
    tags: ['The Fool', 'Symbolism', 'Major Arcana', 'Beginnings']
  },
  {
    id: 2,
    title: 'Celtic Cross Spread Tutorial for Beginners',
    content: 'The Celtic Cross spread might seem intimidating at first, but it\'s actually quite straightforward...',
    author: {
      id: 102,
      name: 'Tran Thi B',
      avatar: '',
      isPremium: false
    },
    category: 'Spreads',
    status: 'published',
    publishedAt: '2023-11-09T10:15:00',
    commentsCount: 24,
    likesCount: 45,
    viewsCount: 310,
    reportedCount: 0,
    tags: ['Celtic Cross', 'Tutorial', 'Spreads', 'Beginners']
  },
  {
    id: 3,
    title: 'How Tarot Changed My Life',
    content: 'I was skeptical at first, but after my first reading, I started to see patterns in my life...',
    author: {
      id: 103,
      name: 'Le Van C',
      avatar: '',
      isPremium: true
    },
    category: 'Personal Stories',
    status: 'published',
    publishedAt: '2023-11-08T09:45:00',
    commentsCount: 16,
    likesCount: 39,
    viewsCount: 205,
    reportedCount: 0,
    tags: ['Personal Growth', 'Transformation', 'Testimonial']
  },
  {
    id: 4,
    title: 'The Connection Between Tarot and Psychology',
    content: 'Jung\'s concept of archetypes bears striking similarities to the Major Arcana...',
    author: {
      id: 104,
      name: 'Pham Van D',
      avatar: '',
      isPremium: false
    },
    category: 'Theory',
    status: 'pending',
    publishedAt: null,
    commentsCount: 0,
    likesCount: 0,
    viewsCount: 0,
    reportedCount: 0,
    tags: ['Psychology', 'Jung', 'Archetypes', 'Major Arcana']
  },
  {
    id: 5,
    title: 'Inappropriate Content - Please Remove',
    content: 'This post contains offensive language and spam links to external websites selling fake products.',
    author: {
      id: 105,
      name: 'Hoang Thi E',
      avatar: '',
      isPremium: false
    },
    category: 'General',
    status: 'reported',
    publishedAt: '2023-11-05T14:20:00',
    commentsCount: 3,
    likesCount: 1,
    viewsCount: 52,
    reportedCount: 5,
    reports: [
      { userId: 101, reason: 'Spam', timestamp: '2023-11-05T15:10:00' },
      { userId: 102, reason: 'Inappropriate Content', timestamp: '2023-11-05T16:05:00' },
      { userId: 103, reason: 'Misleading', timestamp: '2023-11-05T18:30:00' },
      { userId: 106, reason: 'Spam', timestamp: '2023-11-06T09:15:00' },
      { userId: 107, reason: 'Offensive Language', timestamp: '2023-11-06T10:45:00' }
    ],
    tags: ['General']
  },
  {
    id: 6,
    title: 'The Hidden Meaning of Pentacles',
    content: 'Pentacles represent more than just material wealth. They symbolize the physical world...',
    author: {
      id: 106,
      name: 'Vo Tan F',
      avatar: '',
      isPremium: true
    },
    category: 'Minor Arcana',
    status: 'published',
    publishedAt: '2023-11-04T11:10:00',
    commentsCount: 9,
    likesCount: 21,
    viewsCount: 178,
    reportedCount: 0,
    tags: ['Pentacles', 'Minor Arcana', 'Symbolism', 'Earth Element']
  },
  {
    id: 7,
    title: 'Tarot Reading Ethics - Boundaries and Responsibilities',
    content: 'As readers, we have a responsibility to our clients. Here are some ethical guidelines I follow...',
    author: {
      id: 107,
      name: 'Do Thi G',
      avatar: '',
      isPremium: false
    },
    category: 'Ethics',
    status: 'pending',
    publishedAt: null,
    commentsCount: 0,
    likesCount: 0,
    viewsCount: 0,
    reportedCount: 0,
    tags: ['Ethics', 'Reading', 'Guidelines', 'Professional Practice']
  },
  {
    id: 8,
    title: 'Comparing Different Tarot Decks - Which Is Best for Beginners?',
    content: 'With so many decks available, choosing your first one can be overwhelming...',
    author: {
      id: 108,
      name: 'Duong Van H',
      avatar: '',
      isPremium: true
    },
    category: 'Decks',
    status: 'published',
    publishedAt: '2023-11-02T16:40:00',
    commentsCount: 31,
    likesCount: 52,
    viewsCount: 412,
    reportedCount: 0,
    tags: ['Decks', 'Rider-Waite', 'Beginners', 'Comparison']
  }
]

// Post Detail Modal
const PostDetailModal = ({ isOpen, onClose, post, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('content')
  const [isEditing, setIsEditing] = useState(false) // For ContentTab edit state

  if (!isOpen || !post) return null

  // Content Tab
  const ContentTab = () => {
    const [formData, setFormData] = useState({
      title: post.title,
      content: post.content,
      category: post.category,
      status: post.status,
      tags: post.tags.join(', ')
    })

    useEffect(() => {
      setFormData({
        title: post.title,
        content: post.content,
        category: post.category,
        status: post.status,
        tags: post.tags.join(', ')
      })
      setIsEditing(false) // Reset edit state when post changes
    }, [post])

    const handleChange = (e) => {
      const { name, value } = e.target
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }

    // Tags are now an array in formData, handle accordingly
    const handleTagsChange = (e) => {
      const tagsString = e.target.value
      setFormData(prev => ({
        ...prev,
        tags: tagsString
      }))
    }

    const handleSubmit = (e) => {
      e.preventDefault()
      const updatedPost = {
        ...post,
        title: formData.title,
        content: formData.content,
        category: formData.category,
        status: formData.status,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) // Ensure no empty tags
      }
      onUpdate(updatedPost)
      setIsEditing(false)
    }

    return (
      <form onSubmit={handleSubmit} className="text-gray-300">
        {!isEditing ? (
          <>
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-100 mb-1">Title</h4>
              <p className="text-gray-400 bg-gray-700 p-2 rounded">{post.title}</p>
            </div>
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-100 mb-1">Author</h4>
              <p className="text-gray-400 bg-gray-700 p-2 rounded">{post.author.name} ({post.author.isPremium ? 'Premium' : 'Standard'})</p>
            </div>
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-100 mb-1">Content</h4>
              <p className="text-gray-400 bg-gray-700 p-2 rounded whitespace-pre-wrap h-64 overflow-y-auto">{post.content}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-100 mb-1">Category</h4>
                <p className="text-gray-400 bg-gray-700 p-2 rounded">{post.category}</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-100 mb-1">Status</h4>
                <p className="text-gray-400 bg-gray-700 p-2 rounded capitalize">{post.status}</p>
              </div>
            </div>
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-100 mb-1">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span key={tag} className="bg-gray-600 text-gray-200 px-2 py-1 rounded-full text-sm">{tag}</span>
                ))}
              </div>
            </div>
             <Button variant="solidDark" onClick={() => setIsEditing(true)} className="mr-2">Edit Post</Button>
          </>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border border-gray-600 bg-gray-700 text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">Content</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={8}
                className="w-full p-2 border border-gray-600 bg-gray-700 text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-600 bg-gray-700 text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Major Arcana">Major Arcana</option>
                  <option value="Minor Arcana">Minor Arcana</option>
                  <option value="Spreads">Spreads</option>
                  <option value="Personal Stories">Personal Stories</option>
                  <option value="Theory">Theory</option>
                  <option value="Ethics">Ethics</option>
                  <option value="Decks">Decks</option>
                  <option value="General">General</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-600 bg-gray-700 text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="published">Published</option>
                  <option value="pending">Pending</option>
                  <option value="reported">Reported</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleTagsChange}
                className="w-full p-2 border border-gray-600 bg-gray-700 text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex justify-end">
              <Button variant="outlineDark" onClick={() => setIsEditing(false)} className="mr-2">Cancel</Button>
              <Button type="submit" variant="solidDark">Save Changes</Button>
            </div>
          </>
        )}
      </form>
    )
  }

  // Comments Tab
  const CommentsTab = () => {
    // Mock comments for now
    const comments = [
      { id: 1, author: 'User A', text: 'Great insights!', date: '2023-11-10' },
      { id: 2, author: 'User B', text: 'I disagree on one point...', date: '2023-11-11' }
    ]
    return (
      <div className="text-gray-300">
        <h4 className="text-lg font-semibold text-gray-100 mb-3">Comments ({comments.length})</h4>
        {comments.length === 0 && <p className="text-gray-500">No comments yet.</p>}
        <ul className="space-y-3">
          {comments.map(comment => (
            <li key={comment.id} className="bg-gray-700 p-3 rounded-lg shadow">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-indigo-400">{comment.author}</span>
                <span className="text-xs text-gray-500">{comment.date}</span>
              </div>
              <p className="text-gray-300">{comment.text}</p>
              <div className="mt-2 flex space-x-2">
                <Button variant="textDark" size="sm" onClick={() => alert('Reply (not implemented)')}><Icon name="reply" className="mr-1"/> Reply</Button>
                <Button variant="textDark" size="sm" onClick={() => alert('Delete (not implemented)')} className="text-red-500 hover:text-red-400"><Icon name="trash" className="mr-1"/> Delete</Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  // Reports Tab
  const ReportsTab = () => {
    const reports = post.reports || []
    return (
      <div className="text-gray-300">
        <h4 className="text-lg font-semibold text-gray-100 mb-3">Reports ({reports.length})</h4>
        {reports.length === 0 ? (
          <p className="text-gray-500">No reports for this post.</p>
        ) : (
          <ul className="space-y-3">
            {reports.map((report, index) => (
              <li key={index} className="bg-gray-700 p-3 rounded-lg shadow">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-indigo-400">User ID: {report.userId}</span>
                  <span className="text-xs text-gray-500">{report.timestamp ? format(parseISO(report.timestamp), 'PPpp') : 'N/A'}</span>
                </div>
                <p className="text-gray-300"><span className="font-medium text-gray-400">Reason:</span> {report.reason}</p>
                 <div className="mt-2 flex space-x-2">
                  <Button variant="textDark" size="sm" onClick={() => alert('View User (not implemented)')}><Icon name="user" className="mr-1"/> View User</Button>
                  <Button variant="textDark" size="sm" onClick={() => alert('Dismiss Report (not implemented)')}><Icon name="checkCircle" className="mr-1"/> Dismiss</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 flex justify-end space-x-2">
            <Button variant="solidDark" onClick={() => alert('Ban User (not implemented)')} className="bg-red-600 hover:bg-red-700"><Icon name="ban" className="mr-1"/> Ban User (Poster)</Button>
            <Button variant="outlineDark" onClick={() => alert('Archive Post (not implemented)')}><Icon name="archive" className="mr-1"/> Archive Post</Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <Card className="bg-gray-800 w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl rounded-lg border border-gray-700">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h3 className="text-xl font-semibold text-gray-100">Post Details: {post.title.substring(0,30)}{post.title.length > 30 && '...'}</h3>
          <Button variant="textDark" onClick={onClose} className="text-gray-400 hover:text-gray-200">
            <Icon name="close" size="lg"/>
          </Button>
        </div>

        <div className="p-4 border-b border-gray-700">
          <div className="flex space-x-1">
            {['content', 'comments', 'reports'].map(tabName => (
              <Button
                key={tabName}
                variant={activeTab === tabName ? 'solidDark' : 'outlineDark'}
                onClick={() => setActiveTab(tabName)}
                className="capitalize px-4 py-2"
              >
                {tabName} {tabName === 'comments' ? `(${post.commentsCount || 0})` : tabName === 'reports' ? `(${post.reportedCount || 0})` : ''}
              </Button>
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {activeTab === 'content' && <ContentTab />}
          {activeTab === 'comments' && <CommentsTab />}
          {activeTab === 'reports' && <ReportsTab />}
        </div>
         <div className="p-4 border-t border-gray-700 flex justify-end">
            <Button variant="outlineDark" onClick={onClose}>Close</Button>
        </div>
      </Card>
    </div>
  )
}

// Filters component
const PostFilters = ({ filters, setFilters, onApplyFilters }) => {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }
  const resetFilters = () => {
    setFilters({ searchTerm: '', category: '', status: '', author: '', sortBy: 'publishedAt_desc' })
    onApplyFilters({ searchTerm: '', category: '', status: '', author: '', sortBy: 'publishedAt_desc' })
  }

  return (
    <Card className="mb-6 bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
                <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-300 mb-1">Search Posts</label>
                <SearchBar
                    value={filters.searchTerm}
                    onChange={(value) => handleFilterChange('searchTerm', value)}
                    placeholder="Search by title, content..."
                    className="bg-gray-700 text-gray-200 border-gray-600 placeholder-gray-500"
                />
            </div>
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                <select
                    id="category"
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full p-2 border border-gray-600 bg-gray-700 text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">All Categories</option>
                    <option value="Major Arcana">Major Arcana</option>
                    <option value="Minor Arcana">Minor Arcana</option>
                    <option value="Spreads">Spreads</option>
                    <option value="Personal Stories">Personal Stories</option>
                    <option value="Theory">Theory</option>
                    <option value="Ethics">Ethics</option>
                    <option value="Decks">Decks</option>
                    <option value="General">General</option>
                </select>
            </div>
            <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                <select
                    id="status"
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full p-2 border border-gray-600 bg-gray-700 text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">All Statuses</option>
                    <option value="published">Published</option>
                    <option value="pending">Pending Review</option>
                    <option value="reported">Reported</option>
                    <option value="archived">Archived</option>
                </select>
            </div>
             <div>
                <label htmlFor="sortBy" className="block text-sm font-medium text-gray-300 mb-1">Sort By</label>
                <select
                    id="sortBy"
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full p-2 border border-gray-600 bg-gray-700 text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="publishedAt_desc">Newest First</option>
                    <option value="publishedAt_asc">Oldest First</option>
                    <option value="commentsCount_desc">Most Comments</option>
                    <option value="likesCount_desc">Most Likes</option>
                    <option value="viewsCount_desc">Most Views</option>
                    <option value="reportedCount_desc">Most Reports</option>
                </select>
            </div>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
            <Button variant="outlineDark" onClick={resetFilters}>Reset Filters</Button>
            <Button variant="solidDark" onClick={() => onApplyFilters(filters)}>Apply Filters</Button>
        </div>
    </Card>
  )
}

// Status badge component
const StatusBadge = ({ status }) => {
  let colorClass = 'bg-gray-500 text-gray-100'
  let iconName = 'info'

  switch (status.toLowerCase()) {
    case 'published':
      colorClass = 'bg-green-600 text-green-100'
      iconName = 'checkCircle'
      break
    case 'pending':
      colorClass = 'bg-yellow-500 text-yellow-100'
      iconName = 'clock'
      break
    case 'reported':
      colorClass = 'bg-red-600 text-red-100'
      iconName = 'flag'
      break
    case 'archived':
      colorClass = 'bg-gray-600 text-gray-200'
      iconName = 'archive'
      break
    default:
      break
  }

  return (
    <span className={`px-2 py-1 inline-flex items-center text-xs font-semibold rounded-full ${colorClass}`}>
      <Icon name={iconName} className="mr-1.5" size="sm"/>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

// Main Forum Component
const Forum = () => {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPost, setSelectedPost] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [filters, setFilters] = useState({
    searchTerm: '',
    category: '',
    status: '',
    sortBy: 'publishedAt_desc' // Default sort
  })

  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 10 // Adjust as needed

  useEffect(() => {
    // Simulate API call
    setLoading(true)
    setTimeout(() => {
      setPosts(MOCK_FORUM_POSTS)
      setFilteredPosts(MOCK_FORUM_POSTS) // Initially show all
      setLoading(false)
    }, 1000)
  }, [])

  const applyFilters = (currentFilters) => {
    setLoading(true)
    let tempPosts = [...posts]

    if (currentFilters.searchTerm) {
      const term = currentFilters.searchTerm.toLowerCase()
      tempPosts = tempPosts.filter(post =>
        post.title.toLowerCase().includes(term) ||
        post.content.toLowerCase().includes(term) ||
        post.author.name.toLowerCase().includes(term)
      )
    }
    if (currentFilters.category) {
      tempPosts = tempPosts.filter(post => post.category === currentFilters.category)
    }
    if (currentFilters.status) {
      tempPosts = tempPosts.filter(post => post.status === currentFilters.status)
    }

    // Sorting
    const [sortKey, sortOrder] = currentFilters.sortBy.split('_')
    tempPosts.sort((a, b) => {
        let valA = a[sortKey];
        let valB = b[sortKey];

        if (sortKey === 'publishedAt') { // Handle date sorting
            valA = a.publishedAt ? parseISO(a.publishedAt) : new Date(0); // Treat null/undefined as very old
            valB = b.publishedAt ? parseISO(b.publishedAt) : new Date(0);
        } else if (typeof valA === 'string') {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
        }


        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });


    setFilteredPosts(tempPosts)
    setCurrentPage(1) // Reset to first page after filtering
    setLoading(false)
  }


  // Calculate current posts for pagination
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost)
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const openPostDetail = (post) => {
    setSelectedPost(post)
    setIsModalOpen(true)
  }
  const closePostDetail = () => {
    setIsModalOpen(false)
    setSelectedPost(null)
  }

  const handleUpdatePost = (updatedPost) => {
    // Simulate API update
    setPosts(prevPosts => prevPosts.map(p => p.id === updatedPost.id ? updatedPost : p))
    setFilteredPosts(prevFiltered => prevFiltered.map(p => p.id === updatedPost.id ? updatedPost : p)) // also update filtered list
    // applyFilters(filters) // Re-apply filters if status or other key fields changed
    closePostDetail()
    // Ideally, show a success toast message here
  }

  const handleViewUser = (userId) => {
    navigate(`/admin/users/${userId}`)
  }

  // Thêm hàm xử lý xoá bài viết
  const handleDeletePost = (postId) => {
    if (window.confirm('Bạn có chắc chắn muốn xoá bài viết này không?')) {
      setLoading(true);
      // Trong dự án thực tế, gọi API để xoá
      setTimeout(() => {
        const updatedPosts = posts.filter(post => post.id !== postId);
        setPosts(updatedPosts);
        setFilteredPosts(updatedPosts);
        setLoading(false);
      }, 500);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null
    const pageNumbers = []
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i)
    }

    return (
      <nav className="mt-8 flex justify-center">
        <ul className="inline-flex items-center -space-x-px">
          <li>
            <Button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outlineDark"
              className="px-3 py-2 ml-0 leading-tight rounded-l-lg"
            >
              <Icon name="chevronLeft" className="w-5 h-5" />
              <span className="sr-only">Previous</span>
            </Button>
          </li>
          {pageNumbers.map(number => (
            <li key={number}>
              <Button
                onClick={() => paginate(number)}
                variant={currentPage === number ? 'solidDark' : 'outlineDark'}
                className="px-3 py-2 leading-tight"
              >
                {number}
              </Button>
            </li>
          ))}
          <li>
            <Button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outlineDark"
              className="px-3 py-2 leading-tight rounded-r-lg"
            >
               <span className="sr-only">Next</span>
              <Icon name="chevronRight" className="w-5 h-5" />
            </Button>
          </li>
        </ul>
      </nav>
    )
  }


  if (error) return <div className="p-6 text-red-500 bg-red-100 border border-red-400 rounded">Error: {error}</div>

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-900 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-100">Forum Management</h1>
          {/* <Button variant="solidDark" onClick={() => alert('Create New Post (not implemented)')}>
            <Icon name="plus" className="mr-2" /> Create New Post
          </Button> */}
        </div>

        <PostFilters filters={filters} setFilters={setFilters} onApplyFilters={applyFilters} />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="xl" color="text-indigo-400"/>
          </div>
        ) : (
          <>
            {currentPosts.length === 0 ? (
                 <Card className="bg-gray-800 p-6 rounded-lg shadow text-center border border-gray-700">
                    <Icon name="searchX" size="2xl" className="text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">No Posts Found</h3>
                    <p className="text-gray-500">Try adjusting your search filters or check back later.</p>
                </Card>
            ) : (
            <Card className="bg-gray-800 shadow-xl rounded-lg overflow-hidden border border-gray-700">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-750">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Author</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">Published</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell">Stats (C/L/V/R)</th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {currentPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-750 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-indigo-400 hover:text-indigo-300 cursor-pointer" onClick={() => openPostDetail(post)}>
                            {post.title.substring(0,40)}{post.title.length > 40 && '...'}
                          </div>
                          <div className="text-xs text-gray-500">ID: {post.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">{post.author.name}</div>
                          <div className={`text-xs ${post.author.isPremium ? 'text-yellow-400' : 'text-gray-500'}`}>
                            {post.author.isPremium ? 'Premium User' : 'Standard User'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{post.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 hidden md:table-cell">
                          {post.publishedAt ? format(parseISO(post.publishedAt), 'MMM d, yyyy HH:mm') : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={post.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 text-center hidden sm:table-cell">
                          {`${post.commentsCount}/${post.likesCount}/${post.viewsCount}/${post.reportedCount}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <div className="flex items-center justify-center space-x-2">
                            <Button variant="textDark" size="sm" onClick={() => openPostDetail(post)} title="View Details">
                              <Icon name="eye" />
                            </Button>
                            <Button variant="textDark" size="sm" onClick={() => handleViewUser(post.author.id)} title="View Author Profile" className="text-sky-400 hover:text-sky-300">
                              <Icon name="user" />
                            </Button>
                            <Button variant="textDark" size="sm" onClick={() => alert(`Archive post ${post.id} (not implemented)`)} title="Archive Post" className="text-orange-400 hover:text-orange-300">
                              <Icon name="archive" />
                            </Button>
                            <Button variant="textDark" size="sm" onClick={() => handleDeletePost(post.id)} title="Delete Post" className="text-red-500 hover:text-red-400">
                              <Icon name="trash" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            )}
            {renderPagination()}
          </>
        )}

        {isModalOpen && selectedPost && (
          <PostDetailModal
            isOpen={isModalOpen}
            onClose={closePostDetail}
            post={selectedPost}
            onUpdate={handleUpdatePost}
          />
        )}
      </div>
    </AdminLayout>
  )
}

export default Forum 