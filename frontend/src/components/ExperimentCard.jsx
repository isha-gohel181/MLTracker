import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Target
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { formatDate, formatNumber, getAccuracyColor, getLossColor } from '../lib/utils';

const ExperimentCard = ({ experiment, onEdit, onDelete, onSelect, isSelected }) => {
  const handleSelect = () => {
    if (onSelect) {
      onSelect(experiment._id);
    }
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${
      isSelected ? 'ring-2 ring-primary' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-1">
              {experiment.modelName}
            </CardTitle>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(experiment.createdAt)}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {onSelect && (
              <Button
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={handleSelect}
              >
                {isSelected ? 'Selected' : 'Select'}
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={`/experiments/${experiment._id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(experiment)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(experiment._id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Accuracy</p>
              <p className={`font-semibold ${getAccuracyColor(experiment.accuracy)}`}>
                {formatNumber(experiment.accuracy)}%
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Loss</p>
              <p className={`font-semibold ${getLossColor(experiment.loss)}`}>
                {formatNumber(experiment.loss)}
              </p>
            </div>
          </div>
        </div>

        {/* Notes */}
        {experiment.notes && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {experiment.notes}
          </p>
        )}

        {/* Tags */}
        {experiment.tags && experiment.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {experiment.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {experiment.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{experiment.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Version count */}
        {experiment.versions && experiment.versions.length > 0 && (
          <div className="flex items-center text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3 mr-1" />
            {experiment.versions.length} version{experiment.versions.length !== 1 ? 's' : ''}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExperimentCard;