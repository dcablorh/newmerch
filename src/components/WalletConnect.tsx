import { ConnectButton } from '@mysten/dapp-kit';

const WalletConnect = () => {
  return (
    <ConnectButton
      className="!bg-primary !text-primary-foreground !font-semibold !rounded-lg !px-5 !py-2.5 hover:!opacity-90 !transition-opacity"
    />
  );
};

export default WalletConnect;
