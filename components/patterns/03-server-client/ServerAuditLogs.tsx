import { getServerAuditNotes } from './actions';

export async function ServerAuditLogs() {
  const notes = await getServerAuditNotes();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Server-Rendered Audit Log ({notes.length})
        </h4>
        <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">
          RSC • 0 KB JS
        </span>
      </div>

      <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md bg-gray-50">
        {notes.map((item) => (
          <li key={item.id} className="p-3 text-sm">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span className="font-medium text-gray-700">{item.author}</span>
              <time>{item.timestamp}</time>
            </div>
            <p className="text-gray-800">{item.note}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}