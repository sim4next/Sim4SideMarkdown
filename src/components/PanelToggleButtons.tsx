import React from 'react'
import { IconEditor, IconPreview, IconToc } from './icons/PanelIcons'

export function PanelToggleButtons(props: {
  kind: 'text' | 'markdown'
  tocVisible: boolean
  editorVisible: boolean
  previewVisible: boolean
  onToggleToc: () => void
  onToggleEditor: () => void
  onTogglePreview: () => void
}) {
  const isMarkdown = props.kind === 'markdown'

  return (
    <div className="panel-toggle-overlay no-drag" aria-label="Panels">
      <div className="dock-group" role="group" aria-label="显示/隐藏面板">
        <button
          className={`seg-btn ${props.tocVisible ? 'active' : ''}`}
          title="Markdown 目录"
          aria-label="Markdown 目录"
          aria-pressed={props.tocVisible}
          disabled={!isMarkdown}
          onClick={props.onToggleToc}
        >
          <IconToc size={14} />
        </button>
        <button
          className={`seg-btn ${props.editorVisible ? 'active' : ''}`}
          title="编辑器"
          aria-label="编辑器"
          aria-pressed={props.editorVisible}
          onClick={props.onToggleEditor}
        >
          <IconEditor size={14} />
        </button>
        <button
          className={`seg-btn ${props.previewVisible ? 'active' : ''}`}
          title="预览"
          aria-label="预览"
          aria-pressed={props.previewVisible}
          disabled={!isMarkdown}
          onClick={props.onTogglePreview}
        >
          <IconPreview size={14} />
        </button>
      </div>
    </div>
  )
}

