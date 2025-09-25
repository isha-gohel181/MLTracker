import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { X, Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'; // Assuming this is your local customized Select

const ExperimentForm = ({ experiment, onSubmit, onClose, availableTags = [] }) => {
  const [formData, setFormData] = useState({
    modelName: '',
    accuracy: '',
    loss: '',
    notes: '',
    tags: [],
  });
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (experiment) {
      setFormData({
        modelName: experiment.modelName || '',
        accuracy: experiment.accuracy?.toString() || '',
        loss: experiment.loss?.toString() || '',
        notes: experiment.notes || '',
        tags: experiment.tags || [],
      });
    }
  }, [experiment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTag = (tag = newTag) => {
    const cleanTag = tag.trim();
    if (cleanTag && !formData.tags.includes(cleanTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, cleanTag],
      }));
    }
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submitData = {
      ...formData,
      accuracy: parseFloat(formData.accuracy),
      loss: parseFloat(formData.loss),
    };

    try {
      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter tags to ensure valid values only
  const validAvailableTags = availableTags
    .filter(
      (tag) =>
        typeof tag === 'string' &&
        tag.trim() !== '' &&
        !formData.tags.includes(tag.trim())
    )
    .map(tag => tag.trim());

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {experiment ? 'Edit Experiment' : 'New Experiment'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Model Name */}
          <div className="space-y-2">
            <Label htmlFor="modelName">Model Name *</Label>
            <Input
              id="modelName"
              name="modelName"
              value={formData.modelName}
              onChange={handleChange}
              placeholder="e.g., ResNet-50, BERT-base"
              required
            />
          </div>

          {/* Accuracy & Loss */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accuracy">Accuracy (%) *</Label>
              <Input
                id="accuracy"
                name="accuracy"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.accuracy}
                onChange={handleChange}
                placeholder="95.5"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="loss">Loss *</Label>
              <Input
                id="loss"
                name="loss"
                type="number"
                min="0"
                step="0.0001"
                value={formData.loss}
                onChange={handleChange}
                placeholder="0.0245"
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes about this experiment..."
              rows={3}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>

            {/* Selected Tags */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}

            {/* Add New Tag Manually */}
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddTag()}
                disabled={!newTag.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Tag Selector via Dropdown */}
            {validAvailableTags.length > 0 && (
              <Select onValueChange={handleAddTag}>
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Select a tag" />
                </SelectTrigger>
                <SelectContent>
                  {validAvailableTags.map(tag => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {experiment ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                experiment ? 'Update' : 'Create'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ExperimentForm;
