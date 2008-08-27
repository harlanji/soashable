<?xml version="1.0" encoding="iso-8859-1"?>
<!--
	
	Copyright (C) 2007  Harlan Iverson <h.iverson at gmail.com>
	
	This program is free software; you can redistribute it and/or
	modify it under the terms of the GNU General Public License
	as published by the Free Software Foundation; either version 2
	of the License, or (at your option) any later version.
	
	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.
	
	You should have received a copy of the GNU General Public License
	along with this program; if not, write to the Free Software
	Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
    
    
    TODO this is here as a hack. Wait until maven-js-plugin has resource support.
-->
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:data="jabber:x:data"
                xmlns="http://www.w3.org/1999/xhtml">

	<xsl:output method="html" encoding="iso-8859-1" indent="no" />

	<xsl:param name="formId" select="'form'"/>

	<xsl:template match="data:x">
		<form id="form-{$formId}" class="dataform">
			<xsl:if test="data:title">
				<h1 class="title"><xsl:value-of select="data:title"/></h1>
			</xsl:if>
			<xsl:if test="data:instructions">
				<div class="instructions">
					<xsl:value-of select="data:instructions"/>
				</div>
			</xsl:if>

			<dl class="form">
				<xsl:apply-templates/>
				<dd><button type="button" id="{$formId}-submit">Submit</button></dd>
			</dl>
		</form>
	</xsl:template>

	
	<!-- This is even more than normal elements, fixed = static text -->
	<xsl:template match="data:field[@type='fixed']">
		<dd><h2><xsl:value-of select="."/></h2></dd>
	</xsl:template>

	<xsl:template match="data:field[@type='hidden']">
		<dd style="display: none"><input id="{@var}" type="hidden" value="{value}"/></dd>
	</xsl:template>
	
	<xsl:template match="data:field">
		<dt>
			<label for="{$formId}-{@var}">
				<xsl:value-of select="@label"/>
			</label>
		</dt>
		<dd>
			<xsl:apply-templates select="." mode="input"/>
		</dd>
	</xsl:template>
	
	<xsl:template match="data:field[@type='list-multi']" mode="input">
		<select id="{$formId}-{@var}" multiple="yes" size="{count(data:option)}">
			<xsl:call-template name="listOptions">
				<xsl:with-param name="field" select="."/>
			</xsl:call-template>
		</select>
	</xsl:template>
	
	<xsl:template match="data:field[@type='list-single']" mode="input">
		<select id="{$formId}-{@var}">
			<xsl:call-template name="listOptions">
				<xsl:with-param name="field" select="."/>
			</xsl:call-template>
		</select>
	</xsl:template>
	
	<xsl:template name="listOptions">
		<xsl:param name="field"/>
		<xsl:for-each select="$field/data:option">
			<option value="{data:value}">
				<!-- FIXME value doesn't work
				<xsl:if test="$field/value == value">
					<xsl:attribute name="selected" value="selected"/>
				</xsl:if>
				-->
				<xsl:value-of select="@label"/>
			</option>
		</xsl:for-each>
	</xsl:template>
	

	<xsl:template match="data:field[@type='boolean']" mode="input">
		<label><input id="{$formId}-{@var}-1" type="radio" value="1">
			<xsl:call-template name="checkedIf">
				<xsl:with-param name="condition" value="value == 1"/>
			</xsl:call-template>
		</input> Yes</label>
		<label><input id="{$formId}-{@var}-0" type="radio" value="0"> 
			<xsl:call-template name="checkedIf">
				<xsl:with-param name="condition" value="value == 0"/>
			</xsl:call-template>
		</input>
		No</label>
	</xsl:template>
	
	<!-- FIXME this method doesn't work -->
	<xsl:template name="checkedIf">
		<xsl:param name="condition"/>
		<xsl:if test="boolean($condition)">
			<xsl:attribute name="checked" value="checked"/>
		</xsl:if>
	</xsl:template>

	<xsl:template match="data:field[@type='text-private']" mode="input">
		<input id="{$formId}-{@var}" type="password" value="{value}"/>
	</xsl:template>

	<xsl:template match="data:field[@type='text-multi']" mode="input">
		<!-- FIXME is there any way around &#160 hack? -->
		<textarea id="{$formId}-{@var}"><xsl:value-of select="value"/>&#160;</textarea>
	</xsl:template>

	<xsl:template match="data:field[@type='text-single']" mode="input">
		<input id="{$formId}-{@var}" type="text" value="{value}"/>
	</xsl:template>

	<xsl:template match="data:field" mode="input">
		<input id="{$formId}-{@var}" type="text" value="{value}"/> (unkonwn type: <xsl:value-of select="@type"/>)
	</xsl:template>

	<xsl:template match="text()|@*|*">
		<xsl:apply-templates/>
	</xsl:template>
</xsl:stylesheet>
