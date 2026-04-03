'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface User {
  id: string
  email: string
  name: string
  subscription: string
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    subscription: 'FREE',
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      if (!res.ok) {
        if (res.status === 403) {
          setError('Admin access required')
          return
        }
        throw new Error('Failed to fetch users')
      }
      const data = await res.json()
      setUsers(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const url = editingUser ? '/api/admin/users' : '/api/admin/users'
      const method = editingUser ? 'PUT' : 'POST'
      
      const body = editingUser 
        ? { userId: editingUser.id, ...formData }
        : formData

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save user')
      }

      setShowForm(false)
      setEditingUser(null)
      setFormData({ name: '', email: '', password: '', subscription: 'FREE' })
      fetchUsers()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      subscription: user.subscription,
    })
    setShowForm(true)
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete user')
      }

      fetchUsers()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingUser(null)
    setFormData({ name: '', email: '', password: '', subscription: 'FREE' })
  }

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
        Loading...
      </div>
    )
  }

  if (error === 'Admin access required') {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h1 style={{ color: '#f43f5e', marginBottom: 20 }}>Access Denied</h1>
        <p style={{ color: '#94a3b8', marginBottom: 20 }}>
          You need Enterprise subscription to access user management.
        </p>
        <Link href="/account" style={{ color: '#06b6d4' }}>
          Go to Account
        </Link>
      </div>
    )
  }

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Link href="/dashboard" style={{ color: '#06b6d4', fontSize: 14, marginRight: 16 }}>
            ← Back to Dashboard
          </Link>
          <h1 style={{ fontSize: '2rem', marginTop: 8 }}>User Management</h1>
        </div>
        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: '12px 24px',
            background: '#06b6d4',
            border: 'none',
            borderRadius: 8,
            color: '#0a0e17',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          + Add User
        </button>
      </div>

      {error && (
        <div style={{
          padding: 12,
          background: 'rgba(244, 63, 94, 0.1)',
          border: '1px solid #f43f5e',
          borderRadius: 8,
          color: '#f43f5e',
          marginBottom: 20,
        }}>
          {error}
        </div>
      )}

      {showForm && (
        <div style={{
          background: '#111827',
          border: '1px solid #1e293b',
          borderRadius: 16,
          padding: 24,
          marginBottom: 24,
        }}>
          <h2 style={{ marginBottom: 20 }}>
            {editingUser ? 'Edit User' : 'Create New User'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, color: '#94a3b8', fontSize: 14 }}>
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: 12,
                    background: '#0a0e17',
                    border: '1px solid #1e293b',
                    borderRadius: 8,
                    color: '#f8fafc',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 8, color: '#94a3b8', fontSize: 14 }}>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={!!editingUser}
                  style={{
                    width: '100%',
                    padding: 12,
                    background: editingUser ? '#1e293b' : '#0a0e17',
                    border: '1px solid #1e293b',
                    borderRadius: 8,
                    color: '#f8fafc',
                    opacity: editingUser ? 0.7 : 1,
                  }}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, color: '#94a3b8', fontSize: 14 }}>
                  Password {editingUser && '(leave empty to keep current)'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingUser}
                  placeholder={editingUser ? '••••••••' : 'Enter password'}
                  style={{
                    width: '100%',
                    padding: 12,
                    background: '#0a0e17',
                    border: '1px solid #1e293b',
                    borderRadius: 8,
                    color: '#f8fafc',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 8, color: '#94a3b8', fontSize: 14 }}>
                  Subscription
                </label>
                <select
                  value={formData.subscription}
                  onChange={(e) => setFormData({ ...formData, subscription: e.target.value })}
                  style={{
                    width: '100%',
                    padding: 12,
                    background: '#0a0e17',
                    border: '1px solid #1e293b',
                    borderRadius: 8,
                    color: '#f8fafc',
                  }}
                >
                  <option value="FREE">Free</option>
                  <option value="PRO">Pro</option>
                  <option value="ENTERPRISE">Enterprise</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                type="submit"
                style={{
                  padding: '12px 24px',
                  background: '#06b6d4',
                  border: 'none',
                  borderRadius: 8,
                  color: '#0a0e17',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {editingUser ? 'Update User' : 'Create User'}
              </button>
              <button
                type="button"
                onClick={cancelForm}
                style={{
                  padding: '12px 24px',
                  background: 'transparent',
                  border: '1px solid #1e293b',
                  borderRadius: 8,
                  color: '#94a3b8',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{
        background: '#111827',
        border: '1px solid #1e293b',
        borderRadius: 16,
        overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#0a0e17' }}>
              <th style={{ padding: 16, textAlign: 'left', color: '#94a3b8', fontWeight: 500 }}>Name</th>
              <th style={{ padding: 16, textAlign: 'left', color: '#94a3b8', fontWeight: 500 }}>Email</th>
              <th style={{ padding: 16, textAlign: 'left', color: '#94a3b8', fontWeight: 500 }}>Subscription</th>
              <th style={{ padding: 16, textAlign: 'left', color: '#94a3b8', fontWeight: 500 }}>Created</th>
              <th style={{ padding: 16, textAlign: 'right', color: '#94a3b8', fontWeight: 500 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderTop: '1px solid #1e293b' }}>
                <td style={{ padding: 16, color: '#f8fafc' }}>{user.name}</td>
                <td style={{ padding: 16, color: '#94a3b8' }}>{user.email}</td>
                <td style={{ padding: 16 }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: 100,
                    fontSize: 12,
                    fontWeight: 600,
                    background: user.subscription === 'ENTERPRISE' ? 'rgba(6, 182, 212, 0.2)' :
                               user.subscription === 'PRO' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(148, 163, 184, 0.2)',
                    color: user.subscription === 'ENTERPRISE' ? '#06b6d4' :
                           user.subscription === 'PRO' ? '#f59e0b' : '#94a3b8',
                  }}>
                    {user.subscription}
                  </span>
                </td>
                <td style={{ padding: 16, color: '#94a3b8' }}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: 16, textAlign: 'right' }}>
                  <button
                    onClick={() => handleEdit(user)}
                    style={{
                      padding: '8px 16px',
                      background: 'transparent',
                      border: '1px solid #06b6d4',
                      borderRadius: 6,
                      color: '#06b6d4',
                      fontSize: 12,
                      cursor: 'pointer',
                      marginRight: 8,
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    style={{
                      padding: '8px 16px',
                      background: 'transparent',
                      border: '1px solid #f43f5e',
                      borderRadius: 6,
                      color: '#f43f5e',
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
