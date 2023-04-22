using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using System.IO.Ports;
using SymbolFactoryDotNet;
using System.Threading;

namespace WindowsFormsApp1
{
    public partial class Form1 : Form
    {
       /*byte id = 0, baund_high = 0, baund_low = 0, di_data = 0, do_data = 0, ai1_data_high = 0, 
        ai1_data_low = 0, ai2_data_high = 0, ai2_data_low = 0, ao1_data_high = 0,
            ao1_data_low = 0, ao2_data_high = 0, ao2_data_low = 0, read_write = 0;*/
        byte[] framedata_tran = { 0, 0, 0, 0, 0, 0, 0, 0 };
        //id,baund_high,baund_low,do_data,ao1_data_high,ao1_data_low,ao2_data_high,ao2_data_low
        byte[] framedata_rei = { 0, 0, 0, 0, 0 };
        //di_data,ai1_data_high,ai1_data_low,ai2_data_high,ai2_data_low
        bool[] bit_data_input = { false, false, false, false, false, false, false, false };
        bool[] bit_data_output = { false, false, false, false, false, false, false, false };
        Int16 ao1_data = 0, ao2_data = 0, ai1_data=0, ai2_data=0, baundrate_slave=9600, id_slave = 0; 
        
        String inputdata = String.Empty;
        delegate void SetTextCallback(string text);
        public Form1()
        {
            InitializeComponent();
            serialPort1.DataReceived += new SerialDataReceivedEventHandler(DataReceive);
            string[] BaudRate = { "1200", "2400", "4800", "9600", "19200", "38400", "57600", "115200" };
            comboBox2.Items.AddRange(BaudRate);
            comboBox3.Items.AddRange(BaudRate);
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            comboBox1.DataSource = SerialPort.GetPortNames();
            comboBox2.SelectedIndex = 7;

        }

        private static byte ConvertBoolArrayToByte(bool[] source)
        {
            byte result = 0;
            // This assumes the array never contains more than 8 elements!
            int index = 8 - source.Length;

            // Loop through the array
            foreach (bool b in source)
            {
                // if the element is 'true' set the bit at that position
                if (b)
                    result |= (byte)(1 << (7 - index));

                index++;
            }

            return result;
        }


        private static bool[] ConvertByteToBoolArray(byte b)
        {
            // prepare the return result
            bool[] result = new bool[8];

            // check each bit in the byte. if 1 set to true, if 0 set to false
            for (int i = 0; i < 8; i++)
                result[i] = (b & (1 << i)) == 0 ? false : true;

            // reverse the array
            Array.Reverse(result);

            return result;
        }




        private void standardControl1_Load(object sender, EventArgs e)
        {

        }

        private void comboBox1_SelectedIndexChanged(object sender, EventArgs e)
        {
            serialPort1.PortName = comboBox1.Text;
        }

        private void label5_Click(object sender, EventArgs e)
        {

        }

        private void label7_Click(object sender, EventArgs e)
        {

        }

        private void timer1_Tick(object sender, EventArgs e)
        {
            if (!serialPort1.IsOpen)
            {
                comboBox1.DataSource = SerialPort.GetPortNames();
                button1.Text = ("Chưa kết nối");
                button1.ForeColor = Color.Red;
                framedata_rei[0] = 0;
                framedata_rei[1] = 0;
                framedata_rei[2] = 0;
                framedata_rei[3] = 0;
                framedata_rei[4] = 0;
            }
            else
            {
                button1.Text = ("Đã kết nối");
                button1.ForeColor = Color.Green;
                serialPort1.Write(framedata_tran, 0, framedata_tran.Length);
            }
            get_data();
            display_data();
        }

        private void get_data()
        {
            bit_data_input = ConvertByteToBoolArray(framedata_rei[0]);
            framedata_tran[3] = ConvertBoolArrayToByte(bit_data_output);
            ai1_data = BitConverter.ToInt16(framedata_rei, 1);
            ai2_data = BitConverter.ToInt16(framedata_rei, 3);
            label13.Text = framedata_tran[3].ToString();
        }

        private void display_data()
        {
            //digital input display
            digital_input(standardControl1, bit_data_input[0]);
            digital_input(standardControl2, bit_data_input[1]);
            digital_input(standardControl3, bit_data_input[2]);
            digital_input(standardControl4, bit_data_input[3]);
            digital_input(standardControl5, bit_data_input[4]);
            digital_input(standardControl6, bit_data_input[5]);
            digital_input(standardControl7, bit_data_input[6]);
            digital_input(standardControl8, bit_data_input[7]);
            //digital output display
            if (bit_data_output[0] == true) { button3.Text = "ON"; } else { button3.Text = "OFF"; }
            if (bit_data_output[1] == true) { button4.Text = "ON"; } else { button4.Text = "OFF"; }
            if (bit_data_output[2] == true) { button5.Text = "ON"; } else { button5.Text = "OFF"; }
            if (bit_data_output[3] == true) { button6.Text = "ON"; } else { button6.Text = "OFF"; }
            if (bit_data_output[4] == true) { button7.Text = "ON"; } else { button7.Text = "OFF"; }
            if (bit_data_output[5] == true) { button8.Text = "ON"; } else { button8.Text = "OFF"; }
            if (bit_data_output[6] == true) { button9.Text = "ON"; } else { button9.Text = "OFF"; }
            if (bit_data_output[7] == true) { button10.Text = "ON"; } else { button10.Text = "OFF"; }
            
            //analog input display
            label9.Text = ai1_data.ToString();
            label10.Text = ai2_data.ToString();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            if (!serialPort1.IsOpen)
            {
                try
                {
                    serialPort1.PortName = comboBox1.Text;
                    serialPort1.BaudRate = Convert.ToInt32(comboBox2.Text);
                    serialPort1.Parity = Parity.None;
                    serialPort1.StopBits = StopBits.One;
                    //serialPort1.BaudRate = 115200;

                    serialPort1.ReceivedBytesThreshold = 5;
                    //serialPort1.DiscardNull = true;
                    //serialPort1.DtrEnable = true;
                    //serialPort1.RtsEnable = true;
                    serialPort1.Open();
                }
                catch
                {
                    MessageBox.Show("Kiểm tra kết nối USB");
                }
            }
            else
            {
                serialPort1.Close();
            }
        }

        private void DataReceive(object obj, SerialDataReceivedEventArgs e)
        {
            //inputdata = serialPort1.ReadExisting();
            serialPort1.DtrEnable = true;
            serialPort1.RtsEnable = true;
            
            int bytes = serialPort1.BytesToRead;
            if (bytes == 5)
            {
                byte[] buffer = new byte[bytes];
                serialPort1.Read(buffer, 0, bytes);
                framedata_rei = buffer.ToArray();
                
                serialPort1.DiscardInBuffer();
            }
           /*
            if (inputdata != String.Empty)
            {
                settext(inputdata);
            }*/
        }
        
        private void settext(string text)
        {
            if (this.label13.InvokeRequired)
            {
                SetTextCallback d = new SetTextCallback(settext);
                this.Invoke(d, new object[] { text });
            }
            else { //this.label13.Text = text;
                   //this.framedata_rei = Encoding.ASCII.GetBytes(text);
            }
        }

        private void digital_input(StandardControl sd, bool value)
        {
            if (value == false)
            {
                sd.DiscreteValue1 = true;
                sd.DiscreteValue2 = false;
            }
            if (value == true)
            {
                sd.DiscreteValue1 = false;
                sd.DiscreteValue2 = true;
            }
        }

        private void digital_output(Int32 port)
        {
            if (bit_data_output[port - 1] == true)
            {
                bit_data_output[port - 1] = false;
            }

            else
            {
                bit_data_output[port - 1] = true;
            }

        }

        private void analog_output(string value,string dac)
        {
            if (dac == "dac1")
            {
                try
                {
                    ao1_data = Int16.Parse(value);
                    byte[] bytes1 = BitConverter.GetBytes(ao1_data);
                    framedata_tran[5] = bytes1[0];
                    framedata_tran[4] = bytes1[1];
                }
                catch (FormatException)
                {
                    MessageBox.Show("Giá trị DAC1 không hợp lệ");
                }
            }

            if (dac == "dac2")
            {
                try
                {
                    ao2_data = Int16.Parse(value);
                    byte[] bytes2 = BitConverter.GetBytes(ao2_data);
                    framedata_tran[7] = bytes2[0];
                    framedata_tran[6] = bytes2[1];
                }
                catch (FormatException)
                {
                    MessageBox.Show("Giá trị DAC2 không hợp lệ");
                }
            }
        }

        private void set_para_modbus(string id, string baund)
        {
            try
            {
                baundrate_slave = Int16.Parse(baund);
                byte[] bytes3 = BitConverter.GetBytes(baundrate_slave);
                framedata_tran[2] = bytes3[0];
                framedata_tran[1] = bytes3[1];

                id_slave = Int16.Parse(id);
                byte[] bytes4 = BitConverter.GetBytes(id_slave);
                framedata_tran[0] = bytes4[0];
            }
            catch (FormatException)
            {
                MessageBox.Show("Giá trị Baund,id không hợp lệ");
            }
            //serialPort1.Write(framedata1, 0, framedata1.Length);
        }
        /// <summary>
        /// 

        private void button3_Click(object sender, EventArgs e)
        {
            digital_output(1);
        }

        private void label10_Click(object sender, EventArgs e)
        {

        }

        private void standardControl9_Load(object sender, EventArgs e)
        {

        }

        private void standardControl2_Load(object sender, EventArgs e)
        {

        }

        private void standardControl4_Load(object sender, EventArgs e)
        {

        }

        private void button4_Click(object sender, EventArgs e)
        {
            digital_output(2);
        }

        private void button5_Click(object sender, EventArgs e)
        {
            digital_output(3);
        }

        private void button6_Click(object sender, EventArgs e)
        {
            digital_output(4);
        }

        private void button7_Click(object sender, EventArgs e)
        {
            digital_output(5);
        }

        private void button8_Click(object sender, EventArgs e)
        {
            digital_output(6);
        }

        private void button9_Click(object sender, EventArgs e)
        {
            digital_output(7);
        }

        private void button10_Click(object sender, EventArgs e)
        {
            digital_output(8);
        }

        private void button11_Click(object sender, EventArgs e)
        {
            set_para_modbus(richTextBox3.Text,comboBox3.Text);
        }

        private void label13_Click(object sender, EventArgs e)
        {

        }

        private void button2_Click(object sender, EventArgs e)
        {
            analog_output(richTextBox2.Text, "dac2");
        }

        private void button12_Click(object sender, EventArgs e)
        {
            analog_output(richTextBox1.Text, "dac1");
        }

        private void richTextBox3_TextChanged(object sender, EventArgs e)
        {

        }

        private void richTextBox2_TextChanged(object sender, EventArgs e)
        {

        }

        private void comboBox3_SelectedIndexChanged(object sender, EventArgs e)
        {

        }
    }
}
