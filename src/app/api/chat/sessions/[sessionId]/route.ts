import { NextRequest, NextResponse } from 'next/server'
import { handleApiError } from '@/lib/errors'
import prisma from '@/lib/prisma'

// PATCH - Update session (pin/archive)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params
    const body = await request.json()
    
    const session = await prisma.chatSession.update({
      where: { id: sessionId },
      data: {
        pinned: body.pinned,
        archived: body.archived,
      },
    })

    return NextResponse.json({ session })
  } catch (error) {
    const errorData = handleApiError(error)
    return NextResponse.json(errorData, { status: errorData.statusCode })
  }
}

// DELETE - Delete session
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params
    
    console.log('Attempting to delete session:', sessionId)
    
    // Check if session exists first
    const existingSession = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: { _count: { select: { messages: true } } }
    })
    
    if (!existingSession) {
      console.log('Session not found:', sessionId)
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }
    
    console.log(`Deleting session ${sessionId} with ${existingSession._count.messages} messages`)
    
    await prisma.chatSession.delete({
      where: { id: sessionId },
    })

    console.log('Session deleted successfully:', sessionId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting session:', error)
    const errorData = handleApiError(error)
    return NextResponse.json(errorData, { status: errorData.statusCode })
  }
}
