Option Explicit

WScript.Echo ChooseFile( )


Function ChooseFile( )
' Select File dialog based on a script by Mayayana
' Known issues:
' * Tree view always opens Desktop folder
' * In Win7/IE8 only the file NAME is returned correctly, the path returned will always be C:\fakepath\
' * If a shortcut to a file is selected, the name of that FILE will be returned, not the shortcut's
    On Error Resume Next
    Dim objIE, strSelected
    ChooseFile = ""
    Set objIE = CreateObject( "InternetExplorer.Application" )
    objIE.visible = False
    objIE.Navigate( "about:blank" )
    Do Until objIE.ReadyState = 4
    Loop
    objIE.Document.Write "<HTML><BODY><INPUT ID=""FileSelect"" NAME=""FileSelect"" TYPE=""file""><BODY></HTML>"
    With objIE.Document.all.FileSelect
        .focus
        .click
        strSelected = .value
    End With
    objIE.Quit
    Set objIE = Nothing
    ChooseFile = strSelected
End Function