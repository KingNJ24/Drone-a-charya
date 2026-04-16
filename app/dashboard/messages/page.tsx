'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { apiClient } from '@/lib/api-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { MessageSquare, Send, Search } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function MessagesPage() {
  const [conversations, setConversations] = useState<any[]>([])
  const [activeConversation, setActiveConversation] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('dronehub_user')
    if (storedUser) setCurrentUser(JSON.parse(storedUser))

    fetchConversations()
  }, [])

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.id)
    }
  }, [activeConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchConversations = async () => {
    try {
      const data = await apiClient.get<any[]>('/api/conversations')
      setConversations(data)
      if (data.length > 0 && !activeConversation) {
        setActiveConversation(data[0])
      }
    } catch (error) {
      toast.error('Failed to load conversations')
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (conversationId: string) => {
    try {
      const data = await apiClient.get<any[]>(`/api/messages/${conversationId}`)
      setMessages(data)
    } catch (error) {
      toast.error('Failed to load messages')
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeConversation || sending) return

    setSending(true)
    try {
      const message = await apiClient.post<any>('/api/messages', {
        conversationId: activeConversation.id,
        content: newMessage,
      })
      setMessages([...messages, message])
      setNewMessage('')
      
      // Update last message in conversation list
      setConversations(conversations.map(c => 
        c.id === activeConversation.id 
          ? { ...c, messages: [message] } 
          : c
      ))
    } catch (error) {
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  if (loading) return <div className="p-8 text-center">Loading messages...</div>

  if (conversations.length === 0) {
    return (
      <div className="mx-auto max-w-lg space-y-6 py-8">
        <Card className="rounded-2xl border-dashed">
          <CardHeader className="text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-muted">
              <MessageSquare className="size-6 text-muted-foreground" />
            </div>
            <CardTitle className="mt-4">No messages yet</CardTitle>
            <CardDescription>
              Connect with other drone enthusiasts to start a conversation.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-8">
            <Link href="/dashboard/explore">
              <Button className="rounded-full">Find People</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Conversations List */}
      <Card className="flex w-80 flex-col rounded-2xl border-border/80 shadow-sm overflow-hidden">
        <CardHeader className="p-4 border-b">
          <CardTitle className="text-lg">Messages</CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search chats..."
              className="h-9 rounded-full pl-9 bg-muted/50"
            />
          </div>
        </CardHeader>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {conversations.map((conv) => {
              const otherParticipant = conv.participants[0]
              const lastMessage = conv.messages[0]
              const isActive = activeConversation?.id === conv.id

              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversation(conv)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all hover:bg-muted/80",
                    isActive && "bg-primary/10 hover:bg-primary/15"
                  )}
                >
                  <Avatar className="size-10 ring-2 ring-background">
                    <AvatarImage src={otherParticipant.avatar} />
                    <AvatarFallback>{otherParticipant.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-semibold">{otherParticipant.name}</p>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {lastMessage ? lastMessage.content : "No messages yet"}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </ScrollArea>
      </Card>

      {/* Chat Window */}
      <Card className="flex flex-1 flex-col rounded-2xl border-border/80 shadow-sm overflow-hidden">
        {activeConversation ? (
          <>
            <CardHeader className="p-4 border-b flex flex-row items-center gap-4 space-y-0">
              <Avatar className="size-10 ring-2 ring-background">
                <AvatarImage src={activeConversation.participants[0].avatar} />
                <AvatarFallback>{activeConversation.participants[0].name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{activeConversation.participants[0].name}</CardTitle>
                <CardDescription className="text-xs">
                  {activeConversation.participants[0].role}
                </CardDescription>
              </div>
            </CardHeader>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => {
                  const isMe = msg.senderId === currentUser?.id
                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex w-full",
                        isMe ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[70%] rounded-2xl px-4 py-2 text-sm",
                          isMe
                            ? "bg-primary text-primary-foreground rounded-tr-none"
                            : "bg-muted text-foreground rounded-tl-none"
                        )}
                      >
                        <p>{msg.content}</p>
                        <p className={cn(
                          "mt-1 text-[10px] opacity-70",
                          isMe ? "text-right" : "text-left"
                        )}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            <div className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="rounded-full border-primary/20 focus-visible:ring-primary/50"
                  disabled={sending}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  className="rounded-full shrink-0"
                  disabled={!newMessage.trim() || sending}
                >
                  <Send className="size-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-muted-foreground">
            Select a conversation to start chatting
          </div>
        )}
      </Card>
    </div>
  )
}
