import React, { useState } from "react";
import { User, BookOpen, Edit2, Trash2, Plus } from "lucide-react";
import { Card } from "../Card";
import { Modal } from "../Modal";
import { Input } from "../Input";
import { Button } from "../Button";

interface ApplicationDataViewProps {
  applicationId: string;
  applicationData: Record<string, unknown>;
  onUpdate: (applicationId: string, updatedData: Record<string, unknown>) => Promise<void>;
  isUpdating?: boolean;
}

const BASIC_INFO_KEYS = [
  "fullName",
  "email",
  "emailAddress",
  "whatsapp",
  "whatsappNumber",
  "dob",
  "dateOfBirth",
  "gender",
  "country",
  "currentCountry",
  "timezone",
  "age",
  "nationality",
  "profession",
  "city",
];

const LEARNING_PREF_KEYS = [
  "quranReadingLevel",
  "topics",
  "topicsOfInterest",
  "classType",
  "preferredClassType",
  "language",
  "languagePreference",
  "preferredDays",
  "preferredTime",
  "goal",
  "availability",
];

// Helper to format camelCase or snake_case to Title Case
const formatKeyName = (key: string) => {
  const result = key.replace(/([A-Z])/g, " $1").replace(/_/g, " ");
  return result.charAt(0).toUpperCase() + result.slice(1).trim();
};

export const ApplicationDataView: React.FC<ApplicationDataViewProps> = ({
  applicationId,
  applicationData,
  onUpdate,
  isUpdating,
}) => {
  const [editingField, setEditingField] = useState<{ key: string; value: string } | null>(null);
  const [addingField, setAddingField] = useState<{ category: string } | null>(null);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const handleEditClick = (key: string, value: unknown) => {
    setEditingField({ key, value: String(value ?? "") });
  };

  const handleSaveEdit = async () => {
    if (!editingField) return;
    const updated = { ...applicationData };
    updated[editingField.key] = editingField.value;
    await onUpdate(applicationId, updated);
    setEditingField(null);
  };

  const handleDeleteClick = async (key: string) => {
    if (window.confirm(`Are you sure you want to delete ${formatKeyName(key)}?`)) {
      const updated = { ...applicationData };
      delete updated[key];
      await onUpdate(applicationId, updated);
    }
  };

  const handleSaveAdd = async () => {
    if (!newKey.trim()) return;
    const updated = { ...applicationData };
    // Convert to camelCase
    const formattedKey = newKey
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_m, chr) => chr.toUpperCase());
    
    updated[formattedKey] = newValue;
    await onUpdate(applicationId, updated);
    setAddingField(null);
    setNewKey("");
    setNewValue("");
  };

  const basicInfo: Record<string, unknown> = {};
  const learningPrefs: Record<string, unknown> = {};
  const otherInfo: Record<string, unknown> = {};

  Object.entries(applicationData).forEach(([key, value]) => {
    if (BASIC_INFO_KEYS.includes(key)) {
      basicInfo[key] = value;
    } else if (LEARNING_PREF_KEYS.includes(key)) {
      learningPrefs[key] = value;
    } else {
      otherInfo[key] = value;
    }
  });

  const renderSection = (
    title: string,
    subtitle: string,
    icon: React.ReactNode,
    data: Record<string, unknown>,
    category: string
  ) => {
    return (
      <Card className="mb-6 border-slate-700/50 bg-slate-800/30">
        <div className="p-5">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-slate-800 rounded-lg text-slate-400 border border-slate-700">
              {icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="text-sm text-slate-400">{subtitle}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(data).map(([key, value]) => (
              <div
                key={key}
                className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 flex flex-col justify-between group hover:border-slate-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {formatKeyName(key)}
                  </span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditClick(key, value)}
                      disabled={isUpdating}
                      className="text-slate-400 hover:text-blue-400 transition-colors disabled:opacity-50"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(key)}
                      disabled={isUpdating}
                      className="text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="text-white font-medium break-words">
                  {value ? String(value) : <span className="text-slate-500 italic">Not provided</span>}
                </div>
              </div>
            ))}

            <button
              onClick={() => setAddingField({ category })}
              disabled={isUpdating}
              className="border border-dashed border-slate-700 hover:border-slate-500 rounded-xl p-4 flex items-center justify-center text-slate-400 hover:text-white transition-colors h-full min-h-[100px]"
            >
              <div className="flex items-center gap-2">
                <Plus size={16} />
                <span className="text-sm font-medium">Add Field</span>
              </div>
            </button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {renderSection(
        "Basic Information",
        "Your personal details submitted during admission.",
        <User size={20} />,
        basicInfo,
        "basic"
      )}

      {renderSection(
        "Learning Preferences",
        "Your course preferences and availability.",
        <BookOpen size={20} />,
        learningPrefs,
        "learning"
      )}

      {Object.keys(otherInfo).length > 0 &&
        renderSection(
          "Other Details",
          "Additional information from your application.",
          <Plus size={20} />,
          otherInfo,
          "other"
        )}

      {/* Edit Field Modal */}
      <Modal
        open={!!editingField}
        onClose={() => setEditingField(null)}
        title={`Edit ${editingField ? formatKeyName(editingField.key) : ""}`}
      >
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Value
            </label>
            <Input
              value={editingField?.value || ""}
              onChange={(e) =>
                setEditingField((prev) => (prev ? { ...prev, value: e.target.value } : null))
              }
              placeholder="Enter value..."
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setEditingField(null)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={isUpdating || !editingField?.value.trim()}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Field Modal */}
      <Modal
        open={!!addingField}
        onClose={() => {
          setAddingField(null);
          setNewKey("");
          setNewValue("");
        }}
        title="Add New Field"
      >
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Field Name
            </label>
            <Input
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="e.g. Previous Experience"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Field Value
            </label>
            <Input
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Enter value..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setAddingField(null);
                setNewKey("");
                setNewValue("");
              }}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveAdd}
              disabled={isUpdating || !newKey.trim() || !newValue.trim()}
            >
              Add Field
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
