import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  Database, 
  Rss, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Settings,
  Download,
  RefreshCw
} from 'lucide-react';

export default function Admin() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rssUrl, setRssUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Simulate upload progress
      setIsProcessing(true);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
        }
      }, 200);
    }
  };

  const handleRSSIngestion = () => {
    if (!rssUrl) return;
    setIsProcessing(true);
    // Simulate RSS processing
    setTimeout(() => {
      setIsProcessing(false);
      setRssUrl('');
    }, 3000);
  };

  const seedData = async () => {
    setIsProcessing(true);
    // Simulate data seeding
    setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
  };

  const systemStats = {
    totalEvents: 156,
    totalCompanies: 23,
    totalClaims: 45,
    lastUpdate: new Date(),
    indexHealth: 'Good',
    apiStatus: 'Online'
  };

  const recentUploads = [
    { name: 'ABC_Corp_ESG_Report_2024.pdf', status: 'processed', size: '2.3 MB', timestamp: '2024-12-15T10:30:00Z' },
    { name: 'GreenEnergy_Sustainability.pdf', status: 'processing', size: '1.8 MB', timestamp: '2024-12-15T09:15:00Z' },
    { name: 'Environmental_News_Feed.json', status: 'completed', size: '456 KB', timestamp: '2024-12-14T16:45:00Z' },
  ];

  const ingestSources = [
    { name: 'Environmental News API', url: 'https://api.envnews.com/feed', status: 'active', lastSync: '2 hours ago' },
    { name: 'SEC ESG Filings', url: 'https://sec.gov/esg-feed', status: 'active', lastSync: '6 hours ago' },
    { name: 'NGO Watchdog Reports', url: 'https://watchdog.org/rss', status: 'inactive', lastSync: '2 days ago' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground">Manage ESG data ingestion and system configuration</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-success" />
            System Healthy
          </Badge>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-1" />
            Settings
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              Indexed ESG events
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Companies</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalCompanies}</div>
            <p className="text-xs text-muted-foreground">
              Monitored entities
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ESG Claims</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalClaims}</div>
            <p className="text-xs text-muted-foreground">
              Processed documents
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Index Health</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{systemStats.indexHealth}</div>
            <p className="text-xs text-muted-foreground">
              Elasticsearch status
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Admin Interface */}
      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upload">File Upload</TabsTrigger>
          <TabsTrigger value="ingest">Data Sources</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PDF Upload */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>ESG Document Upload</CardTitle>
                <CardDescription>Upload ESG reports and sustainability documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <div className="space-y-2">
                    <h3 className="font-medium">Drop files here or click to browse</h3>
                    <p className="text-sm text-muted-foreground">
                      Supports PDF, DOC, TXT files up to 50MB
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                  />
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    Choose Files
                  </Button>
                </div>

                {selectedFile && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{selectedFile.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                        </div>
                      </div>
                      {isProcessing ? (
                        <Badge variant="secondary">Processing...</Badge>
                      ) : (
                        <Badge variant="outline" className="text-success border-success/30 bg-success/10">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Processed
                        </Badge>
                      )}
                    </div>
                    
                    {isProcessing && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Processing...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} className="w-full" />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Uploads */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Recent Uploads</CardTitle>
                <CardDescription>Recently processed documents and files</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentUploads.map((upload, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{upload.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {upload.size} • {new Date(upload.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        <Badge 
                          variant={
                            upload.status === 'completed' ? 'default' :
                            upload.status === 'processed' ? 'secondary' : 'outline'
                          }
                          className={
                            upload.status === 'completed' ? 'text-success border-success/30 bg-success/10' : ''
                          }
                        >
                          {upload.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ingest" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* RSS Feed Ingestion */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>RSS Feed Ingestion</CardTitle>
                <CardDescription>Add RSS feeds for automatic data collection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Input
                    placeholder="Enter RSS feed URL..."
                    value={rssUrl}
                    onChange={(e) => setRssUrl(e.target.value)}
                  />
                  <Button 
                    onClick={handleRSSIngestion}
                    disabled={!rssUrl || isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Rss className="w-4 h-4 mr-2" />
                    )}
                    Add RSS Source
                  </Button>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Bulk Data Upload</h4>
                  <Textarea
                    placeholder="Paste JSON array of events..."
                    className="min-h-[100px]"
                  />
                  <Button variant="outline" className="w-full">
                    Process JSON Data
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Active Sources */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Data Sources</CardTitle>
                <CardDescription>Configured ingestion sources and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ingestSources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{source.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{source.url}</div>
                        <div className="text-xs text-muted-foreground">Last sync: {source.lastSync}</div>
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        <Badge 
                          variant={source.status === 'active' ? 'default' : 'secondary'}
                          className={
                            source.status === 'active' 
                              ? 'text-success border-success/30 bg-success/10' 
                              : 'text-warning-foreground border-warning/30 bg-warning/10'
                          }
                        >
                          {source.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <RefreshCw className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="processing" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Data Processing Pipeline</CardTitle>
              <CardDescription>Monitor and control the ESG data processing workflow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-border rounded-lg text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Database className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">Data Extraction</h3>
                  <p className="text-sm text-muted-foreground mb-3">Extract text and metadata from documents</p>
                  <Badge variant="outline" className="text-success border-success/30 bg-success/10">
                    Active
                  </Badge>
                </div>

                <div className="p-4 border border-border rounded-lg text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Settings className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">Classification</h3>
                  <p className="text-sm text-muted-foreground mb-3">Categorize and score environmental events</p>
                  <Badge variant="outline" className="text-success border-success/30 bg-success/10">
                    Processing
                  </Badge>
                </div>

                <div className="p-4 border border-border rounded-lg text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <AlertCircle className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">Greenwash Detection</h3>
                  <p className="text-sm text-muted-foreground mb-3">Compare claims vs evidence</p>
                  <Badge variant="outline" className="text-success border-success/30 bg-success/10">
                    Ready
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Processing Queue</h4>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Refresh
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing documents...</span>
                    <span>3 of 5 completed</span>
                  </div>
                  <Progress value={60} className="w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Demo Data Management</CardTitle>
                <CardDescription>Seed the system with demo data for testing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button 
                    onClick={seedData}
                    disabled={isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Database className="w-4 h-4 mr-2" />
                    )}
                    Seed Demo Data
                  </Button>
                  
                  <div className="text-sm text-muted-foreground">
                    This will create sample ESG events, companies, and claims for demonstration purposes.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current system health and configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Elasticsearch</span>
                    <Badge variant="outline" className="text-success border-success/30 bg-success/10">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm">OpenAI API</span>
                    <Badge variant="outline" className="text-success border-success/30 bg-success/10">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm">Demo Mode</span>
                    <Badge variant="secondary">
                      Enabled
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm">Last Index Update</span>
                    <span className="text-sm text-muted-foreground">
                      {systemStats.lastUpdate.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}