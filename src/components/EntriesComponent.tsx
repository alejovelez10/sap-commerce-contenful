import React from 'react'
import { MultipleEntryReferenceEditor } from '@contentful/field-editor-reference';

function  EntriesComponent({sdk , customRenderer}: any) {
  return (
    <MultipleEntryReferenceEditor
    renderCustomCard={customRenderer}
    viewType="link"
    sdk={sdk}
    isInitiallyDisabled
    hasCardEditActions
    parameters={{
        instance: {
            showCreateEntityAction: true,
            showLinkEntityAction: true,
        },
    }}
/>
  )
}

export default EntriesComponent