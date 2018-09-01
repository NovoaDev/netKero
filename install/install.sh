#!/bin/bash
#Tamaño ventana
printf '\033[8;32;115t'
#Color de letra
blue=$(echo '' '\033[34m')
white=$(echo '' '\033[0m')
#Banner
echo "$blue"             
echo " __         ______     __         ______       __  __     ______   __     __        "
echo "/\ \       /\  __ \   /\ \       /\  __ \     /\ \/\ \   /\__  _\ /\ \   /\ \       "
echo "\ \ \____  \ \ \/\ \  \ \ \____  \ \  __ \    \ \ \_\ \  \/_/\ \/ \ \ \  \ \ \____  "
echo " \ \_____\  \ \_____\  \ \_____\  \ \_\ \_\    \ \_____\    \ \_\  \ \_\  \ \_____\ "
echo "  \/_____/   \/_____/   \/_____/   \/_/\/_/     \/_____/     \/_/   \/_/   \/_____/ "                                                                               
echo "$white"
echo "=================================================================================="
echo ""
#variables de entorno
echo "                          $blue[CREANDO VARIABLES DE ENTORNO]"
echo ""
export NETKERO_SERVER_SQL=127.0.0.1
export NETKERO_PORT_SQL=3306
export NETKERO_USER_SQL=root
export NETKERO_PASS_SQL=toor
export NETKERO_DB_SQL=netkero
export NETKERO_DB_VAL1=papa
export NETKERO_DB_VAL2=frita
export NETKERO_DB_VAL3=rica
#crear tabla mysql
echo "                          $blue[CREANDO TABLA MYSQL]"
echo "$white"
echo "=================================================================================="
echo ""
mysql -u root -p'toor' << EOF
create database netkero;
EOF