#!/bin/sh
node app/run --start --url http://www.iparts.pl/auto/iveco,daily-ii-platforma-podwozie-od-1999,55-9524.html &
node app/run --start --url http://www.iparts.pl/auto/iveco,daily-iii-bus-od-2006,55-9745.html &
node app/run --start --url http://www.iparts.pl/auto/iveco,daily-iii-nadwozie-pelne-kombi-od-2006,55-9525.html &
node app/run --start --url http://www.iparts.pl/auto/iveco,daily-iii-platforma-podwozie-od-2006,55-9527.html &
node app/run --start --url http://www.iparts.pl/auto/iveco,daily-iii-wywrotka-od-2006,55-9526.html &
node app/run --start --url http://www.iparts.pl/auto/iveco,eurocargo-od-1991,55-3421.html &
node app/run --start --url http://www.iparts.pl/auto/iveco,stralis-od-2002,55-4927.html &
node app/run --start --url http://www.iparts.pl/auto/iveco,trakker-od-2004,55-5483.html &
wait
echo OK
