import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Filter, Eye, ExternalLink, Calendar } from 'lucide-react';
import { mockEvents, getSeverityColor, getImpactScoreColor, getCategoryIcon } from '@/data/mockData';
import { format } from 'date-fns';

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [impactRange, setImpactRange] = useState([-5, 5]);
  const [severityFilters, setSeverityFilters] = useState<number[]>([]);
  const [sourceFilters, setSourceFilters] = useState<string[]>([]);

  const filteredEvents = mockEvents.filter(event => {
    if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !event.body.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedCompany && event.company !== selectedCompany) return false;
    if (selectedCategory && event.category !== selectedCategory) return false;
    if (selectedLocation && !event.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false;
    if (event.impactScore < impactRange[0] || event.impactScore > impactRange[1]) return false;
    if (severityFilters.length > 0 && !severityFilters.includes(event.severity)) return false;
    if (sourceFilters.length > 0 && !sourceFilters.includes(event.sourceType)) return false;
    return true;
  });

  const companies = [...new Set(mockEvents.map(e => e.company))];
  const categories = [...new Set(mockEvents.map(e => e.category))];
  const locations = [...new Set(mockEvents.map(e => e.location))];
  const sources = [...new Set(mockEvents.map(e => e.sourceType))];

  const toggleSeverityFilter = (severity: number) => {
    setSeverityFilters(prev => 
      prev.includes(severity) 
        ? prev.filter(s => s !== severity)
        : [...prev, severity]
    );
  };

  const toggleSourceFilter = (source: string) => {
    setSourceFilters(prev => 
      prev.includes(source) 
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCompany('');
    setSelectedCategory('');
    setSelectedLocation('');
    setImpactRange([-5, 5]);
    setSeverityFilters([]);
    setSourceFilters([]);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Explore ESG Events</h1>
          <p className="text-muted-foreground">Search and filter environmental, social & governance events</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{filteredEvents.length} events</Badge>
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Panel */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
            <CardDescription>Refine your search criteria</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search */}
            <div>
              <label className="text-sm font-medium mb-2 block">Search Keywords</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Company Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Company</label>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Companies</SelectItem>
                  {companies.map(company => (
                    <SelectItem key={company} value={company}>{company}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {getCategoryIcon(category)} {category.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Locations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Impact Score Range */}
            <div>
              <label className="text-sm font-medium mb-3 block">
                Impact Score Range: {impactRange[0]} to {impactRange[1]}
              </label>
              <Slider
                value={impactRange}
                onValueChange={setImpactRange}
                min={-5}
                max={5}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Severity Filters */}
            <div>
              <label className="text-sm font-medium mb-3 block">Severity Level</label>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map(severity => (
                  <div key={severity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`severity-${severity}`}
                      checked={severityFilters.includes(severity)}
                      onCheckedChange={() => toggleSeverityFilter(severity)}
                    />
                    <label htmlFor={`severity-${severity}`} className="text-sm">
                      Level {severity} {severity <= 2 ? '(Low)' : severity === 3 ? '(Medium)' : '(High)'}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Source Type Filters */}
            <div>
              <label className="text-sm font-medium mb-3 block">Source Type</label>
              <div className="space-y-2">
                {sources.map(source => (
                  <div key={source} className="flex items-center space-x-2">
                    <Checkbox
                      id={`source-${source}`}
                      checked={sourceFilters.includes(source)}
                      onCheckedChange={() => toggleSourceFilter(source)}
                    />
                    <label htmlFor={`source-${source}`} className="text-sm capitalize">
                      {source}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          {filteredEvents.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No events found</h3>
                <p className="text-muted-foreground text-center">
                  Try adjusting your filters or search terms to find relevant ESG events.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredEvents.map((event) => (
              <Card key={event.id} className="shadow-card hover:shadow-elevated transition-smooth">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 pr-4">
                      {/* Header badges */}
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className={getSeverityColor(event.severity)}>
                          {getCategoryIcon(event.category)} Severity {event.severity}
                        </Badge>
                        <Badge variant="secondary">
                          {event.category.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline">
                          {event.sourceType}
                        </Badge>
                        {event.scope !== 'unknown' && (
                          <Badge variant="outline">
                            {event.scope}
                          </Badge>
                        )}
                      </div>

                      {/* Title and content */}
                      <h3 className="text-lg font-semibold mb-2 text-foreground">
                        {event.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {event.body}
                      </p>

                      {/* Metadata */}
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(event.timestamp), 'MMM dd, yyyy')}
                        </span>
                        <span>{event.company}</span>
                        <span>{event.location}</span>
                      </div>
                    </div>

                    {/* Impact score and actions */}
                    <div className="text-right space-y-3">
                      <div>
                        <div className={`text-2xl font-bold ${getImpactScoreColor(event.impactScore)}`}>
                          {event.impactScore > 0 ? '+' : ''}{event.impactScore.toFixed(1)}
                        </div>
                        <div className="text-xs text-muted-foreground">Impact Score</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{event.title}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className={getSeverityColor(event.severity)}>
                                  Severity {event.severity}
                                </Badge>
                                <Badge variant="secondary">
                                  {event.category.replace('_', ' ')}
                                </Badge>
                              </div>
                              <div className="prose prose-sm max-w-none">
                                <p>{event.body}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-medium">Company:</span> {event.company}
                                </div>
                                <div>
                                  <span className="font-medium">Location:</span> {event.location}
                                </div>
                                <div>
                                  <span className="font-medium">Source:</span> {event.sourceType}
                                </div>
                                <div>
                                  <span className="font-medium">Scope:</span> {event.scope}
                                </div>
                                <div>
                                  <span className="font-medium">Sentiment:</span> {event.sentiment.toFixed(2)}
                                </div>
                                <div>
                                  <span className="font-medium">Impact Score:</span> 
                                  <span className={getImpactScoreColor(event.impactScore)}>
                                    {event.impactScore.toFixed(1)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}