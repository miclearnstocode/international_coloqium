import { FaEdit, FaUndo, FaSave, FaTrash } from 'react-icons/fa';
import { PageDefinition, SectionDefinition } from '@/app/admin/content-structures';

export const ContentEditorView = ({ selectedPage, editorAvailable, draftContent, hasUnsavedChanges, onFieldChange, onListItemChange, onAddListItem, onDeleteListItem, onSave, onDiscard }: {
  selectedPage: PageDefinition;
  editorAvailable: boolean;
  draftContent: SectionDefinition[];
  hasUnsavedChanges: boolean;
  onFieldChange: (sIdx: number, key: string, value: string) => void;
  onListItemChange: (sIdx: number, iIdx: number, data: any) => void;
  onAddListItem: (sIdx: number) => void;
  onDeleteListItem: (sIdx: number, iIdx: number) => void;
  onSave: () => void;
  onDiscard: () => void;
}) => (
  <div className="flex flex-col h-full">
    <div className="flex justify-between items-center mb-4">
      <span className="text-xs font-bold text-gray-700">Editing: {selectedPage.name}</span>
      <div className="flex gap-2">
        <button onClick={onDiscard} disabled={!hasUnsavedChanges} className={`text-xs px-2 py-1 rounded border flex items-center gap-1 ${hasUnsavedChanges ? 'bg-white text-gray-600 border-gray-300' : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'}`}>
          <FaUndo /> Discard
        </button>
        <button onClick={onSave} disabled={!hasUnsavedChanges} className={`text-xs px-2 py-1 rounded border flex items-center gap-1 ${hasUnsavedChanges ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed'}`}>
          <FaSave /> Save
        </button>
      </div>
    </div>

    <div className="flex-1 bg-gray-50 rounded-lg border border-gray-200 p-4 overflow-y-auto">
      {editorAvailable ? (
        <div className="space-y-6">
          {draftContent.map((section, sIdx) => (
            <div key={sIdx} className="bg-white p-4 rounded border border-gray-200 shadow-sm">
              <h4 className="text-sm font-bold text-gray-800 mb-3 border-b pb-2">{section.section}</h4>
              <div className="space-y-3">
                {section.fields.map((field, fIdx) => (
                  <div key={fIdx}>
                    <label className="block text-xs text-gray-500 mb-1">{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea value={field.value} onChange={e => onFieldChange(sIdx, field.key, e.target.value)} rows={3} className="w-full p-2 border border-gray-300 rounded text-xs resize-none" />
                    ) : (
                      <input type="text" value={field.value} onChange={e => onFieldChange(sIdx, field.key, e.target.value)} className="w-full p-2 border border-gray-300 rounded text-xs" />
                    )}
                  </div>
                ))}
                {section.list && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-blue-600">{section.list.label}</span>
                      <button onClick={() => onAddListItem(sIdx)} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100">+ Add Item</button>
                    </div>
                    <div className="space-y-2">
                      {section.list.items.map((item, iIdx) => (
                        <div key={iIdx} className="flex gap-2 items-center bg-gray-50 p-2 rounded border border-gray-100">
                          <span className="text-[10px] text-gray-400 font-mono w-4">{iIdx + 1}.</span>
                          <div className="flex-1 flex flex-wrap gap-1">
                            {Object.keys(item).map(key => Array.isArray(item[key]) ? (
                              <input key={key} type="text" value={item[key].join(', ')} onChange={e => onListItemChange(sIdx, iIdx, { ...item, [key]: e.target.value.split(',').map((s: string) => s.trim()) })} placeholder={key} className="w-full p-1 border border-gray-200 rounded text-[10px]" />
                            ) : (
                              <input key={key} type="text" value={item[key]} onChange={e => onListItemChange(sIdx, iIdx, { ...item, [key]: e.target.value })} placeholder={key} className="flex-1 min-w-20 p-1 border border-gray-200 rounded text-[10px]" />
                            ))}
                          </div>
                          <button onClick={() => onDeleteListItem(sIdx, iIdx)} className="text-red-400 hover:text-red-600 p-1"><FaTrash className="text-[10px]" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
          <FaEdit className="text-3xl mb-2" />
          <p>Editor not available for this page yet.</p>
        </div>
      )}
    </div>

    {hasUnsavedChanges && (
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-3 flex justify-between items-center">
        <span className="text-xs text-blue-800 font-medium">You have unsaved changes.</span>
        <div className="flex gap-2">
          <button onClick={onDiscard} className="text-xs text-gray-600">Discard</button>
          <button onClick={onSave} className="text-xs bg-blue-600 text-white px-3 py-1 rounded">Save Changes</button>
        </div>
      </div>
    )}
  </div>
);