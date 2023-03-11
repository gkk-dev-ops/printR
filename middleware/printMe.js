const Printer = require('node-printer');
const fs = require('fs');

function printMe(fileToPrint) {
  // Get available printers list
  const listPrinter = Printer.list();
  console.log(listPrinter);

  // Create a new Pinter from available devices
  const printer = new Printer(listPrinter[0]);

  // Print from a buffer, file path or text
  const fileBuffer = fs.readFileSync(fileToPrint);
  const jobFromBuffer = printer.printBuffer(fileBuffer);

  // Listen events from job
  jobFromBuffer.once('sent', function() {
    jobFromBuffer.on('completed', function() {
      console.log('Job ' + jobFromBuffer.identifier + 'has been printed');
      jobFromBuffer.removeAllListeners();
    });
  });
}

module.exports = printMe;
