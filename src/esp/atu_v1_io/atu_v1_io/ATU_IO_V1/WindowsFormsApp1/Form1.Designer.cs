namespace WindowsFormsApp1
{
    partial class Form1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Form1));
            this.button1 = new System.Windows.Forms.Button();
            this.comboBox1 = new System.Windows.Forms.ComboBox();
            this.label1 = new System.Windows.Forms.Label();
            this.standardControl1 = new SymbolFactoryDotNet.StandardControl();
            this.comboBox2 = new System.Windows.Forms.ComboBox();
            this.label2 = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.comboBox3 = new System.Windows.Forms.ComboBox();
            this.label4 = new System.Windows.Forms.Label();
            this.button2 = new System.Windows.Forms.Button();
            this.richTextBox3 = new System.Windows.Forms.RichTextBox();
            this.standardControl2 = new SymbolFactoryDotNet.StandardControl();
            this.standardControl3 = new SymbolFactoryDotNet.StandardControl();
            this.standardControl4 = new SymbolFactoryDotNet.StandardControl();
            this.standardControl5 = new SymbolFactoryDotNet.StandardControl();
            this.standardControl6 = new SymbolFactoryDotNet.StandardControl();
            this.standardControl7 = new SymbolFactoryDotNet.StandardControl();
            this.standardControl8 = new SymbolFactoryDotNet.StandardControl();
            this.serialPort1 = new System.IO.Ports.SerialPort(this.components);
            this.timer1 = new System.Windows.Forms.Timer(this.components);
            this.button3 = new System.Windows.Forms.Button();
            this.button4 = new System.Windows.Forms.Button();
            this.button5 = new System.Windows.Forms.Button();
            this.button6 = new System.Windows.Forms.Button();
            this.button7 = new System.Windows.Forms.Button();
            this.button8 = new System.Windows.Forms.Button();
            this.button9 = new System.Windows.Forms.Button();
            this.button10 = new System.Windows.Forms.Button();
            this.label5 = new System.Windows.Forms.Label();
            this.label6 = new System.Windows.Forms.Label();
            this.label7 = new System.Windows.Forms.Label();
            this.label8 = new System.Windows.Forms.Label();
            this.label9 = new System.Windows.Forms.Label();
            this.label10 = new System.Windows.Forms.Label();
            this.label11 = new System.Windows.Forms.Label();
            this.richTextBox1 = new System.Windows.Forms.RichTextBox();
            this.richTextBox2 = new System.Windows.Forms.RichTextBox();
            this.label12 = new System.Windows.Forms.Label();
            this.button11 = new System.Windows.Forms.Button();
            this.button12 = new System.Windows.Forms.Button();
            this.label13 = new System.Windows.Forms.Label();
            ((System.ComponentModel.ISupportInitialize)(this.standardControl1)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.standardControl2)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.standardControl3)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.standardControl4)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.standardControl5)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.standardControl6)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.standardControl7)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.standardControl8)).BeginInit();
            this.SuspendLayout();
            // 
            // button1
            // 
            this.button1.Location = new System.Drawing.Point(244, 30);
            this.button1.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(145, 32);
            this.button1.TabIndex = 0;
            this.button1.Text = "Kết nối";
            this.button1.UseVisualStyleBackColor = true;
            this.button1.Click += new System.EventHandler(this.button1_Click);
            // 
            // comboBox1
            // 
            this.comboBox1.FormattingEnabled = true;
            this.comboBox1.Location = new System.Drawing.Point(8, 39);
            this.comboBox1.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.comboBox1.Name = "comboBox1";
            this.comboBox1.Size = new System.Drawing.Size(108, 24);
            this.comboBox1.TabIndex = 1;
            this.comboBox1.SelectedIndexChanged += new System.EventHandler(this.comboBox1_SelectedIndexChanged);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(11, 7);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(37, 16);
            this.label1.TabIndex = 2;
            this.label1.Text = "COM";
            // 
            // standardControl1
            // 
            this.standardControl1.AnalogIntValue1 = ((short)(0));
            this.standardControl1.AnalogValue1 = 0D;
            this.standardControl1.AnimationMode = SymbolFactoryNetEngine.AnimationModeOptions.DiscreteColorFill;
            this.standardControl1.BackColor = System.Drawing.Color.Transparent;
            this.standardControl1.BackStyle = SymbolFactoryNetEngine.BackStyleOptions.Transparent;
            this.standardControl1.BandsCollection.Add(new SymbolFactoryNetEngine.Band(90D, 90, false, SymbolFactoryNetEngine.BandStyleOptions.Original, System.Drawing.Color.Silver, "Band1"));
            this.standardControl1.BandsCollection.Add(new SymbolFactoryNetEngine.Band(0D, 0, false, SymbolFactoryNetEngine.BandStyleOptions.Shaded, System.Drawing.Color.Lime, "Band2"));
            this.standardControl1.BlinkColor = System.Drawing.Color.Red;
            this.standardControl1.Category = "1Btn.cat2";
            this.standardControl1.DebugData = new SymbolFactoryDotNet.DebugClass(resources.GetString("standardControl1.DebugData"));
            this.standardControl1.FillColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(128)))), ((int)(((byte)(0)))));
            this.standardControl1.Location = new System.Drawing.Point(4, 105);
            this.standardControl1.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.standardControl1.Name = "standardControl1";
            this.standardControl1.Size = new System.Drawing.Size(43, 40);
            this.standardControl1.SymbolHandle = ((long)(646493301));
            this.standardControl1.TabIndex = 3;
            this.standardControl1.Load += new System.EventHandler(this.standardControl1_Load);
            // 
            // comboBox2
            // 
            this.comboBox2.FormattingEnabled = true;
            this.comboBox2.Location = new System.Drawing.Point(121, 39);
            this.comboBox2.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.comboBox2.Name = "comboBox2";
            this.comboBox2.Size = new System.Drawing.Size(108, 24);
            this.comboBox2.TabIndex = 4;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(117, 7);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(69, 16);
            this.label2.TabIndex = 5;
            this.label2.Text = "Baundrate";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(623, 8);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(69, 16);
            this.label3.TabIndex = 10;
            this.label3.Text = "Baundrate";
            // 
            // comboBox3
            // 
            this.comboBox3.FormattingEnabled = true;
            this.comboBox3.Location = new System.Drawing.Point(627, 40);
            this.comboBox3.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.comboBox3.Name = "comboBox3";
            this.comboBox3.Size = new System.Drawing.Size(108, 24);
            this.comboBox3.TabIndex = 9;
            this.comboBox3.SelectedIndexChanged += new System.EventHandler(this.comboBox3_SelectedIndexChanged);
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(465, 7);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(58, 16);
            this.label4.TabIndex = 8;
            this.label4.Text = "ID Slave";
            // 
            // button2
            // 
            this.button2.Location = new System.Drawing.Point(629, 244);
            this.button2.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.button2.Name = "button2";
            this.button2.Size = new System.Drawing.Size(105, 33);
            this.button2.TabIndex = 6;
            this.button2.Text = "Cài đặt";
            this.button2.UseVisualStyleBackColor = true;
            this.button2.Click += new System.EventHandler(this.button2_Click);
            // 
            // richTextBox3
            // 
            this.richTextBox3.Location = new System.Drawing.Point(460, 40);
            this.richTextBox3.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.richTextBox3.MaxLength = 255;
            this.richTextBox3.Name = "richTextBox3";
            this.richTextBox3.Size = new System.Drawing.Size(162, 23);
            this.richTextBox3.TabIndex = 21;
            this.richTextBox3.Text = "";
            this.richTextBox3.TextChanged += new System.EventHandler(this.richTextBox3_TextChanged);
            // 
            // standardControl2
            // 
            this.standardControl2.AnalogIntValue1 = ((short)(0));
            this.standardControl2.AnalogValue1 = 0D;
            this.standardControl2.AnimationMode = SymbolFactoryNetEngine.AnimationModeOptions.DiscreteColorFill;
            this.standardControl2.BackColor = System.Drawing.Color.Transparent;
            this.standardControl2.BackStyle = SymbolFactoryNetEngine.BackStyleOptions.Transparent;
            this.standardControl2.BandsCollection.Add(new SymbolFactoryNetEngine.Band(90D, 90, false, SymbolFactoryNetEngine.BandStyleOptions.Original, System.Drawing.Color.Red, "Band1"));
            this.standardControl2.BandsCollection.Add(new SymbolFactoryNetEngine.Band(0D, 0, false, SymbolFactoryNetEngine.BandStyleOptions.Shaded, System.Drawing.Color.Lime, "Band2"));
            this.standardControl2.BlinkColor = System.Drawing.Color.Red;
            this.standardControl2.Category = "1Btn.cat2";
            this.standardControl2.DebugData = new SymbolFactoryDotNet.DebugClass(resources.GetString("standardControl2.DebugData"));
            this.standardControl2.FillColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(128)))), ((int)(((byte)(0)))));
            this.standardControl2.Location = new System.Drawing.Point(52, 105);
            this.standardControl2.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.standardControl2.Name = "standardControl2";
            this.standardControl2.Size = new System.Drawing.Size(43, 40);
            this.standardControl2.SymbolHandle = ((long)(646493301));
            this.standardControl2.TabIndex = 22;
            // 
            // standardControl3
            // 
            this.standardControl3.AnalogIntValue1 = ((short)(0));
            this.standardControl3.AnalogValue1 = 0D;
            this.standardControl3.AnimationMode = SymbolFactoryNetEngine.AnimationModeOptions.DiscreteColorFill;
            this.standardControl3.BackColor = System.Drawing.Color.Transparent;
            this.standardControl3.BackStyle = SymbolFactoryNetEngine.BackStyleOptions.Transparent;
            this.standardControl3.BandsCollection.Add(new SymbolFactoryNetEngine.Band(90D, 90, false, SymbolFactoryNetEngine.BandStyleOptions.Original, System.Drawing.Color.Red, "Band1"));
            this.standardControl3.BandsCollection.Add(new SymbolFactoryNetEngine.Band(0D, 0, false, SymbolFactoryNetEngine.BandStyleOptions.Shaded, System.Drawing.Color.Lime, "Band2"));
            this.standardControl3.BlinkColor = System.Drawing.Color.Red;
            this.standardControl3.Category = "1Btn.cat2";
            this.standardControl3.DebugData = new SymbolFactoryDotNet.DebugClass(resources.GetString("standardControl3.DebugData"));
            this.standardControl3.FillColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(128)))), ((int)(((byte)(0)))));
            this.standardControl3.Location = new System.Drawing.Point(100, 105);
            this.standardControl3.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.standardControl3.Name = "standardControl3";
            this.standardControl3.Size = new System.Drawing.Size(43, 40);
            this.standardControl3.SymbolHandle = ((long)(646493301));
            this.standardControl3.TabIndex = 23;
            // 
            // standardControl4
            // 
            this.standardControl4.AnalogIntValue1 = ((short)(0));
            this.standardControl4.AnalogValue1 = 0D;
            this.standardControl4.AnimationMode = SymbolFactoryNetEngine.AnimationModeOptions.DiscreteColorFill;
            this.standardControl4.BackColor = System.Drawing.Color.Transparent;
            this.standardControl4.BackStyle = SymbolFactoryNetEngine.BackStyleOptions.Transparent;
            this.standardControl4.BandsCollection.Add(new SymbolFactoryNetEngine.Band(90D, 90, false, SymbolFactoryNetEngine.BandStyleOptions.Original, System.Drawing.Color.Red, "Band1"));
            this.standardControl4.BandsCollection.Add(new SymbolFactoryNetEngine.Band(0D, 0, false, SymbolFactoryNetEngine.BandStyleOptions.Shaded, System.Drawing.Color.Lime, "Band2"));
            this.standardControl4.BlinkColor = System.Drawing.Color.Red;
            this.standardControl4.Category = "1Btn.cat2";
            this.standardControl4.DebugData = new SymbolFactoryDotNet.DebugClass(resources.GetString("standardControl4.DebugData"));
            this.standardControl4.FillColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(128)))), ((int)(((byte)(0)))));
            this.standardControl4.Location = new System.Drawing.Point(148, 105);
            this.standardControl4.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.standardControl4.Name = "standardControl4";
            this.standardControl4.Size = new System.Drawing.Size(43, 40);
            this.standardControl4.SymbolHandle = ((long)(646493301));
            this.standardControl4.TabIndex = 24;
            this.standardControl4.Load += new System.EventHandler(this.standardControl4_Load);
            // 
            // standardControl5
            // 
            this.standardControl5.AnalogIntValue1 = ((short)(0));
            this.standardControl5.AnalogValue1 = 0D;
            this.standardControl5.AnimationMode = SymbolFactoryNetEngine.AnimationModeOptions.DiscreteColorFill;
            this.standardControl5.BackColor = System.Drawing.Color.Transparent;
            this.standardControl5.BackStyle = SymbolFactoryNetEngine.BackStyleOptions.Transparent;
            this.standardControl5.BandsCollection.Add(new SymbolFactoryNetEngine.Band(90D, 90, false, SymbolFactoryNetEngine.BandStyleOptions.Original, System.Drawing.Color.Red, "Band1"));
            this.standardControl5.BandsCollection.Add(new SymbolFactoryNetEngine.Band(0D, 0, false, SymbolFactoryNetEngine.BandStyleOptions.Shaded, System.Drawing.Color.Lime, "Band2"));
            this.standardControl5.BlinkColor = System.Drawing.Color.Red;
            this.standardControl5.Category = "1Btn.cat2";
            this.standardControl5.DebugData = new SymbolFactoryDotNet.DebugClass(resources.GetString("standardControl5.DebugData"));
            this.standardControl5.FillColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(128)))), ((int)(((byte)(0)))));
            this.standardControl5.Location = new System.Drawing.Point(196, 105);
            this.standardControl5.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.standardControl5.Name = "standardControl5";
            this.standardControl5.Size = new System.Drawing.Size(43, 40);
            this.standardControl5.SymbolHandle = ((long)(646493301));
            this.standardControl5.TabIndex = 25;
            // 
            // standardControl6
            // 
            this.standardControl6.AnalogIntValue1 = ((short)(0));
            this.standardControl6.AnalogValue1 = 0D;
            this.standardControl6.AnimationMode = SymbolFactoryNetEngine.AnimationModeOptions.DiscreteColorFill;
            this.standardControl6.BackColor = System.Drawing.Color.Transparent;
            this.standardControl6.BackStyle = SymbolFactoryNetEngine.BackStyleOptions.Transparent;
            this.standardControl6.BandsCollection.Add(new SymbolFactoryNetEngine.Band(90D, 90, false, SymbolFactoryNetEngine.BandStyleOptions.Original, System.Drawing.Color.Red, "Band1"));
            this.standardControl6.BandsCollection.Add(new SymbolFactoryNetEngine.Band(0D, 0, false, SymbolFactoryNetEngine.BandStyleOptions.Shaded, System.Drawing.Color.Lime, "Band2"));
            this.standardControl6.BlinkColor = System.Drawing.Color.Red;
            this.standardControl6.Category = "1Btn.cat2";
            this.standardControl6.DebugData = new SymbolFactoryDotNet.DebugClass(resources.GetString("standardControl6.DebugData"));
            this.standardControl6.FillColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(128)))), ((int)(((byte)(0)))));
            this.standardControl6.Location = new System.Drawing.Point(244, 105);
            this.standardControl6.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.standardControl6.Name = "standardControl6";
            this.standardControl6.Size = new System.Drawing.Size(43, 40);
            this.standardControl6.SymbolHandle = ((long)(646493301));
            this.standardControl6.TabIndex = 26;
            // 
            // standardControl7
            // 
            this.standardControl7.AnalogIntValue1 = ((short)(0));
            this.standardControl7.AnalogValue1 = 0D;
            this.standardControl7.AnimationMode = SymbolFactoryNetEngine.AnimationModeOptions.DiscreteColorFill;
            this.standardControl7.BackColor = System.Drawing.Color.Transparent;
            this.standardControl7.BackStyle = SymbolFactoryNetEngine.BackStyleOptions.Transparent;
            this.standardControl7.BandsCollection.Add(new SymbolFactoryNetEngine.Band(90D, 90, false, SymbolFactoryNetEngine.BandStyleOptions.Original, System.Drawing.Color.Red, "Band1"));
            this.standardControl7.BandsCollection.Add(new SymbolFactoryNetEngine.Band(0D, 0, false, SymbolFactoryNetEngine.BandStyleOptions.Shaded, System.Drawing.Color.Lime, "Band2"));
            this.standardControl7.BlinkColor = System.Drawing.Color.Red;
            this.standardControl7.Category = "1Btn.cat2";
            this.standardControl7.DebugData = new SymbolFactoryDotNet.DebugClass(resources.GetString("standardControl7.DebugData"));
            this.standardControl7.FillColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(128)))), ((int)(((byte)(0)))));
            this.standardControl7.Location = new System.Drawing.Point(292, 105);
            this.standardControl7.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.standardControl7.Name = "standardControl7";
            this.standardControl7.Size = new System.Drawing.Size(43, 40);
            this.standardControl7.SymbolHandle = ((long)(646493301));
            this.standardControl7.TabIndex = 27;
            // 
            // standardControl8
            // 
            this.standardControl8.AnalogIntValue1 = ((short)(0));
            this.standardControl8.AnalogValue1 = 0D;
            this.standardControl8.AnimationMode = SymbolFactoryNetEngine.AnimationModeOptions.DiscreteColorFill;
            this.standardControl8.BackColor = System.Drawing.Color.Transparent;
            this.standardControl8.BackStyle = SymbolFactoryNetEngine.BackStyleOptions.Transparent;
            this.standardControl8.BandsCollection.Add(new SymbolFactoryNetEngine.Band(90D, 90, false, SymbolFactoryNetEngine.BandStyleOptions.Original, System.Drawing.Color.Red, "Band1"));
            this.standardControl8.BandsCollection.Add(new SymbolFactoryNetEngine.Band(0D, 0, false, SymbolFactoryNetEngine.BandStyleOptions.Shaded, System.Drawing.Color.Lime, "Band2"));
            this.standardControl8.BlinkColor = System.Drawing.Color.Red;
            this.standardControl8.Category = "1Btn.cat2";
            this.standardControl8.DebugData = new SymbolFactoryDotNet.DebugClass(resources.GetString("standardControl8.DebugData"));
            this.standardControl8.FillColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(128)))), ((int)(((byte)(0)))));
            this.standardControl8.Location = new System.Drawing.Point(340, 105);
            this.standardControl8.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.standardControl8.Name = "standardControl8";
            this.standardControl8.Size = new System.Drawing.Size(43, 40);
            this.standardControl8.SymbolHandle = ((long)(646493301));
            this.standardControl8.TabIndex = 28;
            // 
            // timer1
            // 
            this.timer1.Enabled = true;
            this.timer1.Tick += new System.EventHandler(this.timer1_Tick);
            // 
            // button3
            // 
            this.button3.Location = new System.Drawing.Point(4, 208);
            this.button3.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.button3.Name = "button3";
            this.button3.Size = new System.Drawing.Size(67, 26);
            this.button3.TabIndex = 29;
            this.button3.Text = "Off 1";
            this.button3.UseVisualStyleBackColor = true;
            this.button3.Click += new System.EventHandler(this.button3_Click);
            // 
            // button4
            // 
            this.button4.Location = new System.Drawing.Point(76, 208);
            this.button4.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.button4.Name = "button4";
            this.button4.Size = new System.Drawing.Size(67, 26);
            this.button4.TabIndex = 30;
            this.button4.Text = "Off 2";
            this.button4.UseVisualStyleBackColor = true;
            this.button4.Click += new System.EventHandler(this.button4_Click);
            // 
            // button5
            // 
            this.button5.Location = new System.Drawing.Point(148, 208);
            this.button5.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.button5.Name = "button5";
            this.button5.Size = new System.Drawing.Size(67, 26);
            this.button5.TabIndex = 31;
            this.button5.Text = "Off 3";
            this.button5.UseVisualStyleBackColor = true;
            this.button5.Click += new System.EventHandler(this.button5_Click);
            // 
            // button6
            // 
            this.button6.Location = new System.Drawing.Point(220, 208);
            this.button6.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.button6.Name = "button6";
            this.button6.Size = new System.Drawing.Size(67, 26);
            this.button6.TabIndex = 32;
            this.button6.Text = "Off 4";
            this.button6.UseVisualStyleBackColor = true;
            this.button6.Click += new System.EventHandler(this.button6_Click);
            // 
            // button7
            // 
            this.button7.Location = new System.Drawing.Point(4, 252);
            this.button7.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.button7.Name = "button7";
            this.button7.Size = new System.Drawing.Size(67, 26);
            this.button7.TabIndex = 33;
            this.button7.Text = "Off 5";
            this.button7.UseVisualStyleBackColor = true;
            this.button7.Click += new System.EventHandler(this.button7_Click);
            // 
            // button8
            // 
            this.button8.Location = new System.Drawing.Point(76, 252);
            this.button8.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.button8.Name = "button8";
            this.button8.Size = new System.Drawing.Size(67, 26);
            this.button8.TabIndex = 34;
            this.button8.Text = "Off 6";
            this.button8.UseVisualStyleBackColor = true;
            this.button8.Click += new System.EventHandler(this.button8_Click);
            // 
            // button9
            // 
            this.button9.Location = new System.Drawing.Point(148, 252);
            this.button9.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.button9.Name = "button9";
            this.button9.Size = new System.Drawing.Size(67, 26);
            this.button9.TabIndex = 35;
            this.button9.Text = "Off 7";
            this.button9.UseVisualStyleBackColor = true;
            this.button9.Click += new System.EventHandler(this.button9_Click);
            // 
            // button10
            // 
            this.button10.Location = new System.Drawing.Point(220, 252);
            this.button10.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.button10.Name = "button10";
            this.button10.Size = new System.Drawing.Size(67, 26);
            this.button10.TabIndex = 36;
            this.button10.Text = "Off 8";
            this.button10.UseVisualStyleBackColor = true;
            this.button10.Click += new System.EventHandler(this.button10_Click);
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(4, 77);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(76, 16);
            this.label5.TabIndex = 38;
            this.label5.Text = "Digital input";
            this.label5.Click += new System.EventHandler(this.label5_Click);
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(5, 179);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(84, 16);
            this.label6.TabIndex = 39;
            this.label6.Text = "Digital output";
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Location = new System.Drawing.Point(456, 77);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(76, 16);
            this.label7.TabIndex = 40;
            this.label7.Text = "ADC input 1";
            this.label7.Click += new System.EventHandler(this.label7_Click);
            // 
            // label8
            // 
            this.label8.AutoSize = true;
            this.label8.Location = new System.Drawing.Point(456, 121);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(76, 16);
            this.label8.TabIndex = 41;
            this.label8.Text = "ADC input 2";
            // 
            // label9
            // 
            this.label9.AutoSize = true;
            this.label9.Location = new System.Drawing.Point(562, 77);
            this.label9.Name = "label9";
            this.label9.Size = new System.Drawing.Size(14, 16);
            this.label9.TabIndex = 42;
            this.label9.Text = "0";
            // 
            // label10
            // 
            this.label10.AutoSize = true;
            this.label10.Location = new System.Drawing.Point(562, 121);
            this.label10.Name = "label10";
            this.label10.Size = new System.Drawing.Size(14, 16);
            this.label10.TabIndex = 43;
            this.label10.Text = "0";
            this.label10.Click += new System.EventHandler(this.label10_Click);
            // 
            // label11
            // 
            this.label11.AutoSize = true;
            this.label11.Location = new System.Drawing.Point(456, 228);
            this.label11.Name = "label11";
            this.label11.Size = new System.Drawing.Size(131, 16);
            this.label11.TabIndex = 44;
            this.label11.Text = "ADC output 2(0-4095)";
            // 
            // richTextBox1
            // 
            this.richTextBox1.Location = new System.Drawing.Point(460, 254);
            this.richTextBox1.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.richTextBox1.Name = "richTextBox1";
            this.richTextBox1.Size = new System.Drawing.Size(98, 23);
            this.richTextBox1.TabIndex = 45;
            this.richTextBox1.Text = "";
            // 
            // richTextBox2
            // 
            this.richTextBox2.Location = new System.Drawing.Point(460, 188);
            this.richTextBox2.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.richTextBox2.Name = "richTextBox2";
            this.richTextBox2.Size = new System.Drawing.Size(98, 23);
            this.richTextBox2.TabIndex = 47;
            this.richTextBox2.Text = "";
            this.richTextBox2.TextChanged += new System.EventHandler(this.richTextBox2_TextChanged);
            // 
            // label12
            // 
            this.label12.AutoSize = true;
            this.label12.Location = new System.Drawing.Point(456, 159);
            this.label12.Name = "label12";
            this.label12.Size = new System.Drawing.Size(131, 16);
            this.label12.TabIndex = 46;
            this.label12.Text = "ADC output 1(0-4095)";
            // 
            // button11
            // 
            this.button11.Location = new System.Drawing.Point(630, 77);
            this.button11.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.button11.Name = "button11";
            this.button11.Size = new System.Drawing.Size(105, 33);
            this.button11.TabIndex = 48;
            this.button11.Text = "Cài đặt";
            this.button11.UseVisualStyleBackColor = true;
            this.button11.Click += new System.EventHandler(this.button11_Click);
            // 
            // button12
            // 
            this.button12.Location = new System.Drawing.Point(629, 179);
            this.button12.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.button12.Name = "button12";
            this.button12.Size = new System.Drawing.Size(105, 33);
            this.button12.TabIndex = 49;
            this.button12.Text = "Cài đặt";
            this.button12.UseVisualStyleBackColor = true;
            this.button12.Click += new System.EventHandler(this.button12_Click);
            // 
            // label13
            // 
            this.label13.AutoSize = true;
            this.label13.Location = new System.Drawing.Point(153, 179);
            this.label13.Name = "label13";
            this.label13.Size = new System.Drawing.Size(14, 16);
            this.label13.TabIndex = 50;
            this.label13.Text = "0";
            this.label13.Click += new System.EventHandler(this.label13_Click);
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(746, 288);
            this.Controls.Add(this.label13);
            this.Controls.Add(this.button12);
            this.Controls.Add(this.button11);
            this.Controls.Add(this.richTextBox2);
            this.Controls.Add(this.label12);
            this.Controls.Add(this.richTextBox1);
            this.Controls.Add(this.label11);
            this.Controls.Add(this.label10);
            this.Controls.Add(this.label9);
            this.Controls.Add(this.label8);
            this.Controls.Add(this.label7);
            this.Controls.Add(this.label6);
            this.Controls.Add(this.label5);
            this.Controls.Add(this.button10);
            this.Controls.Add(this.button9);
            this.Controls.Add(this.button8);
            this.Controls.Add(this.button7);
            this.Controls.Add(this.button6);
            this.Controls.Add(this.button5);
            this.Controls.Add(this.button4);
            this.Controls.Add(this.button3);
            this.Controls.Add(this.standardControl8);
            this.Controls.Add(this.standardControl7);
            this.Controls.Add(this.standardControl6);
            this.Controls.Add(this.standardControl5);
            this.Controls.Add(this.standardControl4);
            this.Controls.Add(this.standardControl3);
            this.Controls.Add(this.standardControl2);
            this.Controls.Add(this.richTextBox3);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.comboBox3);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.button2);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.comboBox2);
            this.Controls.Add(this.standardControl1);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.comboBox1);
            this.Controls.Add(this.button1);
            this.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.Name = "Form1";
            this.Text = "Control ATU_V1 Modbus RTU by Tran Anh Tu";
            this.Load += new System.EventHandler(this.Form1_Load);
            ((System.ComponentModel.ISupportInitialize)(this.standardControl1)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.standardControl2)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.standardControl3)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.standardControl4)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.standardControl5)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.standardControl6)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.standardControl7)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.standardControl8)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button button1;
        private System.Windows.Forms.ComboBox comboBox1;
        private System.Windows.Forms.Label label1;
        private SymbolFactoryDotNet.StandardControl standardControl1;
        private System.Windows.Forms.ComboBox comboBox2;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.ComboBox comboBox3;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Button button2;
        private System.Windows.Forms.RichTextBox richTextBox3;
        private SymbolFactoryDotNet.StandardControl standardControl2;
        private SymbolFactoryDotNet.StandardControl standardControl3;
        private SymbolFactoryDotNet.StandardControl standardControl4;
        private SymbolFactoryDotNet.StandardControl standardControl5;
        private SymbolFactoryDotNet.StandardControl standardControl6;
        private SymbolFactoryDotNet.StandardControl standardControl7;
        private SymbolFactoryDotNet.StandardControl standardControl8;
        private System.IO.Ports.SerialPort serialPort1;
        private System.Windows.Forms.Timer timer1;
        private System.Windows.Forms.Button button3;
        private System.Windows.Forms.Button button4;
        private System.Windows.Forms.Button button5;
        private System.Windows.Forms.Button button6;
        private System.Windows.Forms.Button button7;
        private System.Windows.Forms.Button button8;
        private System.Windows.Forms.Button button9;
        private System.Windows.Forms.Button button10;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.Label label8;
        private System.Windows.Forms.Label label9;
        private System.Windows.Forms.Label label10;
        private System.Windows.Forms.Label label11;
        private System.Windows.Forms.RichTextBox richTextBox1;
        private System.Windows.Forms.RichTextBox richTextBox2;
        private System.Windows.Forms.Label label12;
        private System.Windows.Forms.Button button11;
        private System.Windows.Forms.Button button12;
        private System.Windows.Forms.Label label13;
    }
}

