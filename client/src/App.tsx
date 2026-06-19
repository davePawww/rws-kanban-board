import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';

function App() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      <h1 className="text-xl font-bold text-red-500 underline">test</h1>
      <Button size="sm">submit</Button>
    </motion.div>
  );
}

export default App;
