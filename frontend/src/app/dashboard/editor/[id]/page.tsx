import { RECENT_DOCS } from "../../data"
import { EditorShell } from "./editor-shell"
import { notFound } from "next/navigation"

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const doc = RECENT_DOCS.find((d) => d.id === id)
  if (!doc) notFound()

  return <EditorShell document={doc} />
}
