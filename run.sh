#!/bin/sh

#nohup node node_modules/forever/bin/forever app/run.js --crawler bazos            &> log/bazos.log &
#nohup node node_modules/forever/bin/forever app/run.js --crawler tipcars          &> log/tipcars.log &
nohup node node_modules/forever/bin/forever app/run.js --crawler sauto            &> log/sauto.log &
nohup node node_modules/forever/bin/forever app/run.js --crawler rajaut           &> log/rajaut.log &
nohup node node_modules/forever/bin/forever app/run.js --crawler rajveteranu      &> log/rajveteranu.log &
nohup node node_modules/forever/bin/forever app/run.js --crawler sportovnivozy    &> log/sportovnivozy.log &
nohup node node_modules/forever/bin/forever app/run.js --crawler autocaris        &> log/autocaris.log &
nohup node node_modules/forever/bin/forever app/run.js --crawler aktualnivozy     &> log/aktualnivozy.log &
nohup node node_modules/forever/bin/forever app/run.js --crawler tipmobile        &> log/tipmobile.log &
nohup node node_modules/forever/bin/forever app/run.js --crawler ceskebazary      &> log/ceskebazary.log &
#nohup node node_modules/forever/bin/forever app/run.js --crawler autoiq           &> log/autoiq.log &
nohup node node_modules/forever/bin/forever app/run.js --crawler dobrakoupe       &> log/dobrakoupe.log &
nohup node node_modules/forever/bin/forever app/run.js --crawler sportovevozidla  &> log/sportovevozidla.log &
nohup node node_modules/forever/bin/forever app/run.js --crawler autanet          &> log/autanet.log &
nohup node node_modules/forever/bin/forever app/run.js --crawler ucar             &> log/ucar.log &
nohup node node_modules/forever/bin/forever app/run.js --crawler neocar           &> log/neocar.log &
nohup node node_modules/forever/bin/forever app/run.js --crawler dasweltauto      &> log/dasweltauto.log &
#nohup node node_modules/forever/bin/forever app/run.js --crawler cars             &> log/cars.log &
nohup node node_modules/forever/bin/forever app/run.js --crawler autobazarbiz     &> log/autobazarbiz.log &
nohup node node_modules/forever/bin/forever app/run.js --crawler avizo            &> log/avizo.log &
nohup node node_modules/forever/bin/forever app/run.js --crawler autobazarcz      &> log/autobazarcz.log &
nohup node node_modules/forever/bin/forever app/run.js --crawler otomoto          &> log/otomoto.log &
nohup node node_modules/forever/bin/forever app/run.js --crawler annonce          &> log/annonce.log &


nohup node node_modules/forever/bin/forever app/run.js --cron                     &> log/cron.log &
