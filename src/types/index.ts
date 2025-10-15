export interface WalletData {
  address: string;
  timestamp: string;
  source: string;
}

export interface TelegramMessage {
  chat_id: string | number;
  text: string;
  parse_mode?: 'Markdown' | 'HTML';
}

export interface ApiResponse {
  success?: boolean;
  error?: string;
  walletCount?: number;
  position?: number;
  totalWallets?: number;
  walletsToday?: number;
  lastUpdated?: string;
  recentWallets?: WalletData[];
  timestamp?: string;
}

export interface WalletFormProps {
  onSubmission: (submitted: boolean) => void;
}
